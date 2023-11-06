import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/env';

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
  addHotel(hotel:FormData):Observable<any>{
   
    return this.httpClient.post<any>("api/Admin/createhotel", hotel)
  }
  updateHotel(hotel:FormData):Observable<any>{
    return this.httpClient.put<any>("api/Admin/updatehotel", hotel)
  }
  deleteHotel(id:number):Observable<any>{
    return this.httpClient.delete<any>("api/Admin/deletehotel"+ id)
  }
  getRoomTypes():Observable<any>{
    return this.httpClient.get<any>("api/Admin/getroomtypes")
  }
  getRoomsInHotel(hotelId:number):Observable<any>{
    return this.httpClient.get<any>("api/Admin/getroomsinhotel" + hotelId)
  }
  updateRoomInHotel(room:FormData):Observable<any>{
    return this.httpClient.put<any>("api/Admin/updateroominhotel", room)
  }
  addRoomInHotel(room:FormData):Observable<any>{
   
    return this.httpClient.post<any>("api/Admin/addroominhotel", room)
  }
  deletroomfromhotel(id:number):Observable<any>{
    return this.httpClient.delete<any>("api/Admin/deleteroomfromhotel"+ id)
  }
  addRoomType(room:FormData):Observable<any>{
   
    return this.httpClient.post<any>("api/Admin/addroomtype", room)
  }
}
