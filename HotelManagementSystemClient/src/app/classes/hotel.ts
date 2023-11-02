import { City } from "./city"
import { HotelRoom } from "./hotel-room"

export class Hotel {
    id: number
    name: string
    address: any
    images: string
    serviceCharges: number
    description: string
    locationLink: any
    amenities: string
    cityId: any
    hotelRooms: HotelRoom[] = []
    city: City
    files: File[]
    constructor() {
        this.id = 0;
        this.name = "";
        this.address = "";
        this.images = "";
        this.city = new City
        this.description = "";
        this.amenities = "";
        this.cityId = 0;
        this.serviceCharges = 0
        this.files = []
    }
}

