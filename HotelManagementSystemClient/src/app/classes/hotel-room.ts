import { Hotel } from "./hotel";
import { RoomType } from "./room-type";

export class HotelRoom {
    id:number
    roomTypeId:number
    price:number;
    totalRooms:number
    images:string
    hotelId:number
    hotel:Hotel
    roomType:RoomType 
    constructor(){
        this.id=0;
        this.roomTypeId=0;
        this.price=0;
        this.totalRooms=0;
        this.images=""
        this.hotelId=0;
        this.hotel= new Hotel;
        this.roomType = new RoomType
    }
}
