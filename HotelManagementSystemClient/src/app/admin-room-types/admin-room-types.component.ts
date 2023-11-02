import { Component } from '@angular/core';
import { RoomType } from '../classes/room-type';
import { HotelService } from '../services/hotel.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-room-types',
  templateUrl: './admin-room-types.component.html',
  styleUrls: ['./admin-room-types.component.scss']
})
export class AdminRoomTypesComponent {
  roomTypes: RoomType[] = []
  roomForm: FormGroup

  constructor(private hotelService: HotelService, private formBuilder:FormBuilder) {
    this.roomForm = formBuilder.group({
      name: [''],})
   }
  ngOnInit() {
  this.getRoomTypes()
  }
  getRoomTypes(){
    this.hotelService.getRoomTypes().subscribe(
      (response) => {
        this.roomTypes = response
      },
      (error) => {
        console.log(error)
      }
    )
  }
  addRoomType(){
    const formData = new FormData();
    // Add your fields and files to the FormData object
    formData.append('name', this.roomForm.get('name')!.value);
    this.hotelService.addRoomType(formData).subscribe(
      (response)=>{
        Swal.fire("Room Updated Successfully")
        
        this.getRoomTypes();
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  delete(id: number) {
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
            Swal.fire("Hotel Deleted Successfully");

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
