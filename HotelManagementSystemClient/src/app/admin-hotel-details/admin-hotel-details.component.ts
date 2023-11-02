import { Component, Input } from '@angular/core';
import { Hotel } from '../classes/hotel';
import { HotelService } from '../services/hotel.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { State } from '../classes/state';
import { City } from '../classes/city';
import { CityService } from '../services/city.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-hotel-details',
  templateUrl: './admin-hotel-details.component.html',
  styleUrls: ['./admin-hotel-details.component.scss']
})
export class AdminHotelDetailsComponent {
  images: string[] = [];
  toggleButton: boolean = true;
  cities: City[] = []
  states: State[] = []
  isUpdated: boolean = false
  hotel: Hotel = new Hotel
  hotelForm: FormGroup = new FormGroup({})
  isFormEnabled:boolean=false
 
  constructor(private hotelService: HotelService, private route: ActivatedRoute, private cityService: CityService, private router: Router, private formBuilder: FormBuilder) {

  }
  ngOnInit() {
    this.fillForm()
    this.getHotel()
    this.getCitiesAndStates();
  }
  getHotel(){
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.hotelService.getHotel(id).subscribe(
        (response) => {
          this.hotel = response;
          console.log(this.hotel)
          this.images = this.hotel.images.split(',');  
          this.fillForm()
          this.hotelForm.disable();
        })
    })
  }
  fillForm() {
    this.hotelForm = this.formBuilder.group({
      name: [this.hotel.name],
      description: [this.hotel.description],
      serviceCharges: [this.hotel.serviceCharges],
      locationLink: [this.hotel.locationLink],
      address: [this.hotel.address],
      cityId: [this.hotel.cityId],
      amenities: [this.hotel.amenities],
      state: [0],
      files: [this.hotel.files || []]

    })
  }
  enableForm() {
    this.hotelForm.enable();
    this.isFormEnabled = true
  }
  getCitiesAndStates() {
    this.cityService.getAllCities().subscribe(
      (response) => {
        this.cities = response;
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

  updateHotel() {
    const formData = new FormData();
    // Add your fields and files to the FormData object
    formData.append('id', this.hotel.id.toString())
    formData.append('name', this.hotelForm.get('name')!.value);
    formData.append('description', this.hotelForm.get('description')!.value);
    formData.append('serviceCharges', this.hotelForm.get('serviceCharges')!.value.toString());
    formData.append('locationLink', this.hotelForm.get('locationLink')!.value);
    formData.append('address', this.hotelForm.get('address')!.value);
    formData.append('cityId', this.hotelForm.get('cityId')!.value.toString());
    formData.append('amenities', this.hotelForm.get('amenities')!.value);
    const files: File[] = this.hotelForm.get('files')?.value;

    if (files && files.length > 0) {
      for (const file of files) {
        formData.append('files', file, file.name);
      }
    }
    this.hotelService.updateHotel(formData).subscribe(
      (response) => {
        Swal.fire("Hotel Updated Successfully")
        this.hotelForm.disable();
      },
      (error) => {
        console.log(error)
      })
  }

  roomsDetails() {
    this.router.navigate(['/roomsdetails', this.hotel.id]);

  }
  cancel(){
    this.hotelForm.disable()
    this.isFormEnabled = false
  }
  onFileChange(event: any) {
    debugger
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
      const fileArray: File[] = Array.from(files);

      // Create an array to hold all selected files
      const imageArray: File[] = [];

      fileArray.forEach((file: File) => {
        // Add the current file to the array
        imageArray.push(file);
      });

      // Set the array of files in your hotelForm
      this.hotelForm.get('files')?.setValue(imageArray);

      console.log(this.hotelForm.get('files')?.value);
    }
  }

}
