import { Component, ViewChild } from '@angular/core';
import { Hotel } from '../../../classes/hotel';
import { HotelRoom } from '../../../classes/hotel-room';
import { HotelService } from '../../services/hotel.service';
import { CityService } from '../../../services/city.service';
import { City } from '../../../classes/city';
import { State } from '../../../classes/state';
import { Subject } from 'rxjs';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin-hotels',
  templateUrl: './admin-hotels.component.html',
  styleUrls: ['./admin-hotels.component.scss']
})
export class AdminHotelsComponent {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  isDtInitialized:boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  hotels:Hotel[]= []
  cities:City[]=[]
  foundCities:City[]=[]
  states:State[]=[]
  cityId: number = 0
  selected: number = 0
  constructor(private hotelService:HotelService, private cityService:CityService, private router:Router){}
  ngOnInit() {
    this.getCitiesAndStates();
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.12.1/i18n/fr-FR.json',
      },
      pagingType: 'full_numbers',
      responsive: true,
    };
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
  getFirstImage(imageString: string): string {
    const images = imageString.split(',');  
    return "https://localhost:7051" + images[0].trim(); // Trim any leading/trailing space
  }
  navigate() {


    this.hotelService.getAll(this.cityId).subscribe(
      (response) => {
        this.hotels = response;
        this.hotels = this.hotels.filter(obj => obj.hotelRooms.length > 0);
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next(this.hotels);
          });
      } else {
          this.isDtInitialized = true;
          this.dtTrigger.next(this.hotels);
      }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  delete(id:number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Delete Hotel?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelService.deleteHotel(id).subscribe(
          (response) => { 
            if(response == true){
              Swal.fire("Hotel Deleted Successfully");
              this.navigate()
            }
            else{
              Swal.fire("Something went wrong.")
            }
          },
          (error) => {
            console.log(error);
          }
        )
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "No" or closed the dialog
        // Put your code for the "No" action here
        
      }
    });
  }
  
}
