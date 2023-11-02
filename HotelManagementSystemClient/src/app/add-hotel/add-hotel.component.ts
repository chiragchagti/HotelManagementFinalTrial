import { Component } from '@angular/core';
import { State } from '../classes/state';
import { City } from '../classes/city';
import { CityService } from '../services/city.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from '../services/hotel.service';
import { error } from 'jquery';
import { Hotel } from '../classes/hotel';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent {
  cities: City[] = [];
  states: State[] = [];
  selected: number = 0;
  foundCities: City[] = [];
  hotelForm: FormGroup
  hotel: Hotel = new Hotel

  // hotelForm = new FormGroup({
  //   name: new FormControl('name',{nonNullable:true, validators:[Validators.required, Validators.minLength(4)]}),
  //   description: new FormControl('desc',{nonNullable:true, validators:[Validators.required, Validators.minLength(50)]}),
  //   serviceCharges: new FormControl(0,{nonNullable:true}),
  //   locationLink: new FormControl('loc',{nonNullable:true}),
  //   address: new FormControl('add',{nonNullable:true}),
  //   cityId: new FormControl(0,{nonNullable:true}),
  //   amenities: new FormControl('amen',{nonNullable:true}),
  //   state: new FormControl(0,{nonNullable:true}),
  //   files: new FormControl(File,{nonNullable:true})
  // })
  constructor(private cityService: CityService, private hotelService: HotelService, private formBuilder: FormBuilder,
    private router:Router) {
    this.hotelForm = formBuilder.group({
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
  ngOnInit() {
    this.getCitiesAndStates();
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
  selectOption() {
    this.foundCities = this.cities.filter((city: City) => city.stateId == this.hotelForm.get('state')?.value);
  }

  addHotel() {
    const formData = new FormData();
    // Add your fields and files to the FormData object
    formData.append('name', this.hotelForm.get('name')!.value);
    formData.append('description', this.hotelForm.get('description')!.value);
    formData.append('serviceChargess', this.hotelForm.get('serviceCharges')!.value.toString());
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
    this.hotelService.addHotel(formData).subscribe(
      (response) => {
        Swal.fire("Hotel added successfully!")
        this.router.navigate(['/hoteldetails', response.id]);
      },
      (error) => {
        console.log(error)
      })
  }
  // onFileChange(event: any) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = (event.target.files[0] as File);
  //     this.hotelForm.get('files')?.setValue(file);
  //     console.log(this.hotelForm.get('image')?.value);
  //   }
  // }
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
//   addHotel() {
//     // Create a FormData object
// // const formData = new FormData();

// // // Add your fields and files to the FormData object
// // formData.append('name', this.hotelForm.get('name')!.value);
// // formData.append('description', this.hotelForm.get('description')!.value);
// // formData.append('serviceChargess', this.hotelForm.get('serviceCharges')!.value.toString());
// // formData.append('locationLink', this.hotelForm.get('locationLink')!.value);
// // formData.append('address', this.hotelForm.get('address')!.value);
// // formData.append('cityId', this.hotelForm.get('cityId')!.value.toString());
// // formData.append('amenities', this.hotelForm.get('amenities')!.value);
// // formData.append('files', this.hotelForm.get('files')!.value.toString());

// // console.log(formData)



//     const hotel: HotelInterface = this.hotelForm.value
//     this.hotelService.addHotel(hotel).subscribe(
//        (response) => {
//          console.log(response)
//        },
//        (error)=>{
//          console.log(error)
//        })
//   }

