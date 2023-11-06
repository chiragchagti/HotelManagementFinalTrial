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
import { Cart } from '../classes/cart';
import { HotelService } from '../services/hotel.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {
  hotelRoom: HotelRoom = new HotelRoom
  newBooking: Booking = new Booking
  currentUser = { id: '' }
  cart:Cart = new Cart

  constructor(private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private bookingService: BookingService) { }

  ngOnInit() {
    console.log(this.router.getCurrentNavigation()?.extras.state)
    this.cart = history.state;
    console.log(this.cart.availabilityResult)
    this.bookingService.getRoomDetails(this.cart.checkAvailability.hotelRoomId).subscribe(
      (response)=> {
        this.hotelRoom = response
      },
      (error)=>{
        console.log(error)
      }
    )

  }
  getFirstImage(imageString: string): string {
    const images = imageString.split(',');
    return "https://localhost:7051" + images[0].trim(); // Trim any leading/trailing space
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
        this.newBooking.adults = this.cart.checkAvailability.adultGuests
        this.newBooking.children = this.cart.checkAvailability.childGuests
        this.newBooking.checkInDate = this.cart.checkAvailability.startDate
        this.newBooking.checkOutDate = this.cart.checkAvailability.endDate
        this.newBooking.hotelRoomId = this.cart.checkAvailability.hotelRoomId
        this.newBooking.totalRooms = this.cart.checkAvailability.roomsRequired
        this.newBooking.priceWithoutGst = this.cart.availabilityResult.subTotal + this.cart.availabilityResult.serviceCharges
        this.newBooking.priceWithGst = this.cart.availabilityResult.totalAmount
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
