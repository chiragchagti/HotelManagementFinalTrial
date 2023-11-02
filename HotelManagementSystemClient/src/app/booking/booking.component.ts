import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { HotelRoom } from '../classes/hotel-room';
import { CheckAvailability } from '../classes/check-availability';
import { AvailabilityResult } from '../classes/availability-result';
import { Booking } from '../classes/booking';
import Swal from 'sweetalert2';
import { error } from 'jquery';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  hotelRoom = new HotelRoom
  checkAvailability = new CheckAvailability
  displayStyle: string = 'none';
  newBooking: Booking = new Booking
  checked: number = 0
  currentUser = { id: '' }
  availabilityResult: AvailabilityResult = new AvailabilityResult
  range: FormGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor(private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private bookingService: BookingService) {
    this.range = this.formBuilder.group({
      start: [null, [Validators.required, this.startDateValidator]],
      end: [null, [Validators.required, this.endValidator]],
    });
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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.checkAvailability.hotelRoomId = params['selectedRoom'];
      this.checkAvailability.roomsRequired = params['rooms'];
      this.checkAvailability.adultGuests = params['adults'];
      this.checkAvailability.childGuests = params['children'];
      this.bookingService.getRoomDetails(this.checkAvailability.hotelRoomId).subscribe(
        (response) => {
          this.hotelRoom = response;
        },
        (error) => {
          console.log(error);
        }
      )
    }
    )

  }
  getFirstImage(imageString: string): string {
    const images = imageString.split(',');
    return "https://localhost:7051" + images[0].trim(); // Trim any leading/trailing space
  }
  checkAvailabilityByDate() {
    this.bookingService.getAll(this.checkAvailability).subscribe(
      (response) => {
        this.availabilityResult = response;
        this.checked = 1
        const filteredAvailability = Object.keys(this.availabilityResult.availabilityByDate)
          .filter((date) => this.availabilityResult.availabilityByDate[date] === false)

        console.log(filteredAvailability)
      },
      (error) => {
        console.log(error);
      }
    )
  }
  createBooking() {
    
      Swal.fire({
        title: 'Confirmation',
        text: 'Confirm Booking',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          var currentUserSession = sessionStorage.getItem("currentUser");
          if (currentUserSession != null) {
            this.currentUser = JSON.parse(currentUserSession)
          }
          this.newBooking.applicationUserId = this.currentUser.id
          this.newBooking.adults = this.checkAvailability.adultGuests
          this.newBooking.children = this.checkAvailability.childGuests
          this.newBooking.checkInDate = this.checkAvailability.startDate
          this.newBooking.checkOutDate = this.checkAvailability.endDate
          this.newBooking.hotelRoomId = this.checkAvailability.hotelRoomId
          this.newBooking.totalRooms = this.checkAvailability.roomsRequired
          this.newBooking.priceWithoutGst = this.availabilityResult.subTotal + this.availabilityResult.serviceCharges
          this.newBooking.priceWithGst = this.availabilityResult.totalAmount
          this.bookingService.createBooking(this.newBooking).subscribe(
            (response) => {
              this.newBooking = response
              this.router.navigateByUrl('/bookingconfirmation', { state: this.newBooking });

            },
            (error) => {
              Swal.fire("Room not available for selected dates")

            }
          )
        }
      })
    
  }
}
