import { Component } from '@angular/core';
import { HotelService } from '../services/hotel.service';
import { CityService } from '../services/city.service';
import { City } from '../classes/city';
import { State } from '../classes/state';
import { Hotel } from '../classes/hotel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  cities: City[] = [];
  states: State[] = [];
  selected: number = 0;
  foundCities: City[] = [];
  hotels: Hotel[] = [];

  cityId: number = 0;
  constructor(private hotelService: HotelService, private cityService: CityService, private router: Router) {
  }
  ngOnInit() {
    this.getCitiesAndStates();
  }
  getCitiesAndStates() {
    this.cityService.getAllCities().subscribe(
      (response) => {
        this.cities = response;
        this.foundCities =response;
      },
      (error) => {
        console.log(error);
      }
    ),
      this.cityService.getAllStates().subscribe(
        (response) => {
          this.states = response;
        },
        (error) => {
          console.log(error);
        }
      )
  }
  selectOption() {
    this.foundCities = this.cities.filter((city: City) => city.stateId == this.selected);

  }
  navigate(event: Event) {


    this.hotelService.getAll(this.cityId).subscribe(
      (response) => {
        this.hotels = response;
        this.hotels = this.hotels.filter(obj => obj.hotelRooms.length > 0);
      },
      (error) => {
        console.log(error);
      }
    )
  }

getFirstImage(imageString: string): string {
  const images = imageString.split(',');  
  return "https://localhost:7051" + images[0].trim(); // Trim any leading/trailing space
}

hotelDetails(id:number){
  this.router.navigate(['/details', id]);
}
}


