import { Component } from '@angular/core';
import { HotelService } from '../services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hotel } from '../classes/hotel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CheckAvailability } from '../classes/check-availability';
import { BookingService } from '../services/booking.service';
import { AvailabilityResult } from '../classes/availability-result';
import { HotelRoom } from '../classes/hotel-room';
import Swal from 'sweetalert2';
import { Cart } from '../classes/cart';


@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent {
  hotel: Hotel = new Hotel
  images: string[] = [];
  selectedRoom: number = 0;
  adults: number = 1;
  children: number = 0;
  checked: number = 0
  hotelRoom = new HotelRoom
  checkAvailability = new CheckAvailability
  rooms: number = 1;
  safeUrl: any
  cart:Cart = new Cart
  range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  availabilityResult: AvailabilityResult = new AvailabilityResult

  constructor(private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private bookingService:BookingService) {
      this.range = this.formBuilder.group({
        start: [null, [Validators.required, this.startDateValidator]],
        end: [null, [Validators.required, this.endValidator]],
      });
  }
  ngOnInit() {
    this.getAll();


  }
  startDateValidator = (control: AbstractControl) => {
    this.checkAvailability.startDate = new Date(control.value);
    const today = new Date();
    this.checkAvailability.startDate.setHours(0, 0, 0, 0);
    
    today.setHours(0, 0, 0, 0);
    if (this.checkAvailability.startDate >= today) {
      return null; // Validation passed
    } else {
      return { matStartDateInvalid: true }; // Validation failed
    }
  }

  endValidator = (control: AbstractControl) => {
    this.checkAvailability.endDate = new Date(control.value);

    this.checkAvailability.endDate.setHours(0, 0, 0, 0);

    if (this.checkAvailability.endDate > this.checkAvailability.startDate) {
      return null; // Validation passed
    } else {
      return { matEndDateInvalid: true }; // Validation failed
    }
  }
  checkAvailabilityByDate() {
    if(this.selectedRoom != 0 && !this.range.invalid){
      this.checkAvailability.adultGuests = this.adults
      this.checkAvailability.childGuests = this.children
      this.checkAvailability.roomsRequired = this.rooms
      this.checkAvailability.hotelRoomId = this.selectedRoom
      this.bookingService.getAll(this.checkAvailability).subscribe(
        (response) => {
          this.availabilityResult = response;
          this.checked = 1
       
        },
        (error) => {
          console.log(error);
        }
      )

    }
    else{
      if(this.selectedRoom == 0){
        Swal.fire("Please select room type.")
      }
else{
  Swal.fire("Please select valid dates")
}
    }
  }
  getAll() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.hotelService.getHotel(id).subscribe(
        (response) => {
          this.hotel = response;
          this.images = this.hotel.images.split(',');
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.hotel.locationLink);

        },
        (error) => {
          console.log(error);
        }
      )

    })
  }
  getFirstImage(imageString: string): string {
    const images = imageString.split(',');
    return "https://localhost:7051" + images[0].trim();  // Trim any leading/trailing space
  }

  // decreaseAdults() {
  //   this.adults = this.adults - 1;
  //   this.roomsRequired(this.adults)
  //   console.log(this.adults)
  // }
  // increaseAdults() {
  //   this.adults = this.adults + 1;
  //   this.roomsRequired(this.adults)
  //   console.log(this.adults)
  // }
  // decreaseChild() {
  //   this.children = this.children - 1;
  //   this.roomsRequired(this.children)
  // }
  // increaseChild() {
  //   this.children = this.children + 1;
  //   this.roomsRequired(this.children)
  // }
  // roomsRequired(guests: number) {
  //   // this.rooms=  Math.ceil(guests / 2)
  //   if (Math.ceil(guests / 2) > this.rooms) {
  //     this.rooms = this.rooms + 1;
  //   }
  // }
  guestsChange() {
    if (Math.ceil(this.adults / 2) > Math.ceil(this.children / 2)) {
      this.rooms = Math.ceil(this.adults / 2)
    }
    else {
      this.rooms = Math.ceil(this.children / 2)
    }
  }
  navigate() {
    this.cart.availabilityResult = this.availabilityResult
    this.cart.checkAvailability = this.checkAvailability
    if (this.selectedRoom == 0) return
    this.router.navigateByUrl('/booking', {state: this.cart});
  }

}

