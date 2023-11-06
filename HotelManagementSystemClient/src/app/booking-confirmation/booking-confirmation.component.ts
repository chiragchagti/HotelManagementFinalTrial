import { Component } from '@angular/core';
import { Booking } from '../classes/booking';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent {
booking:Booking = new Booking
constructor(private route:ActivatedRoute){}
ngOnInit(){
  this.booking = history.state;
}
}
