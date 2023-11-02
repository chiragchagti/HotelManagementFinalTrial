import { Component } from '@angular/core';
import { HotelService } from '../services/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Hotel } from '../classes/hotel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss']
})
export class HotelDetailsComponent {
  hotel:Hotel = new Hotel
  images:string[]=[];
  selectedRoom:number=0;
  adults:number=1;
  children:number=0;
  rooms:number=1;
  safeUrl:any
  constructor(private hotelService:HotelService,
    private route: ActivatedRoute,
    private router:Router,
    private sanitizer: DomSanitizer){
      
    }
  ngOnInit() {
    this.getAll();
 
  
  }
  getAll() 
  { 
    this.route.params.subscribe(params => {
      const id = params['id']; 
    this.hotelService.getHotel(id).subscribe(
    (response) => {
      this.hotel = response;
     this.images = this.hotel.images.split(',');  
     this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.hotel.locationLink); 
  
    },
    (error) => {
      console.log(error);
    }
  )

})
}
getFirstImage(imageString: string): string {
  const images = imageString.split(',');    
  return "https://localhost:7051" + images[0].trim();  // Trim any leading/trailing space
}

decreaseAdults(){
  this.adults= this.adults-1;
  this.roomsRequired(this.adults)
}
increaseAdults(){
  this.adults= this.adults+1;
  this.roomsRequired(this.adults)
}
decreaseChild(){
  this.children= this.children-1;
  this.roomsRequired(this.children)
}
increaseChild(){
  this.children= this.children+1;
  this.roomsRequired(this.children)
}
roomsRequired(guests:number){
// this.rooms=  Math.ceil(guests / 2)
if(Math.ceil(guests/2)>this.rooms){
  this.rooms=this.rooms + 1;
}

}
navigate(){
  if(this.selectedRoom == 0) return
  this.router.navigate(['/booking/',this.selectedRoom, this.rooms ,this.adults,this.children]);
}

}

