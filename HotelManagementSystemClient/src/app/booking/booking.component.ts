import { Component, ViewChild } from '@angular/core';
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
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import {
  PaymentIntent,
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { switchMap, Observable } from 'rxjs';
import { env } from 'src/env';


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
@ViewChild(StripeCardNumberComponent)
  card!: StripeCardNumberComponent;

  public cardOptions: StripeCardElementOptions = {
      style: {
        base: {
          fontWeight: 400,
          fontFamily: 'Circular',
          fontSize: '14px',
          iconColor: '#666EE8',
          color: '#002333',
          '::placeholder': {
            color: '#919191',
          },
        },
      },
    };
  
  public elementsOptions: StripeElementsOptions = {
      locale: 'en',
    };

    paymentForm: FormGroup = this.formBuilder.group({
      name: ['John', [Validators.required]],
      email: ['john@gmail.com', [Validators.required]],
      amount: [100, [Validators.required, Validators.pattern(/\d+/)]],
  });

  constructor(private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private bookingService: BookingService, 
    private http: HttpClient,
    private stripeService: StripeService
    ) { }

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

  pay(): void {
    if (this.paymentForm.valid) {
      this.createPaymentIntent(this.paymentForm.get('amount')?.value)
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret!, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.paymentForm.get('name')?.value,
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              console.log("succeded")
            }
          }
        });
    } else {
      console.log(this.paymentForm);
    }
  }

createPaymentIntent(amount: number): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `api/Booking/create-payment-intent`,
      { amount }
    );
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
