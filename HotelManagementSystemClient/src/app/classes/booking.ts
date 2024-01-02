import { HotelRoom } from "./hotel-room"

export class Booking {
    id:number=0
    applicationUserId:string =''
    checkInDate:Date = new Date('dd/mm/yyyy')
    checkOutDate:Date = new Date
    adults:number=0
    children:number=0
    priceWithoutGst:number=0
    priceWithGst:number=0
    totalRooms:number=0
    bookingStatus:string =''
    hotelRoomId:number =0
    hotelRoom:HotelRoom = new HotelRoom
    applicationUser:ApplicationUser = new ApplicationUser 
pageCount:number = 0 

}
export class ApplicationUser{
name:string =''
}


