import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/env';
import { CheckAvailability } from '../classes/check-availability';
import { Booking } from '../classes/booking';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private httpClient:HttpClient) { }
  getAll(CheckAvailability:CheckAvailability):Observable<any>{
    return this.httpClient.post<any>("api/Booking/checkroomavailability", CheckAvailability)
  }
  
  getRoomDetails(id:number):Observable<any>{
    return this.httpClient.get<any>("api/Booking/gethotelroom/"+ id)
  }
  createBooking(booking:Booking):Observable<any>{
    return this.httpClient.post<any>("api/Booking/createbooking/", booking)
  }
  getBookings(userId:string, page:number):Observable<any>{
return this.httpClient.get<any>("api/Booking/getbookings/" + userId + "/" + page)
  }
  getBookingsAdmin(page:number):Observable<any>{
    return this.httpClient.get<any>("api/Booking/getbookingsadmin" + page )
      }
}
