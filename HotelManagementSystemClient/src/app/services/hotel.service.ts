import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/env';
import { Hotel } from '../classes/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  constructor(private httpClient:HttpClient) { }

  
  getAll(cityId:number):Observable<any>{
    return this.httpClient.get<any>("api/Home/"+cityId +"/hotels")
  }
  getHotel(id:number):Observable<any>{
    return this.httpClient.get<any>("api/Home/"+id)
  }
  getFeaturedHotels():Observable<any>{
    return this.httpClient.get<any>("api/Home/hotels")
    
  }
}
