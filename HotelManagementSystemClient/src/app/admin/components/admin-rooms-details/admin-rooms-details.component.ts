import { Component, EventEmitter, Output } from '@angular/core';
import { HotelRoom } from '../../../classes/hotel-room';
import { HotelService } from '../../services/hotel.service';
import { ActivatedRoute, Route } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomType } from '../../../classes/room-type';

@Component({
  selector: 'app-admin-rooms-details',
  templateUrl: './admin-rooms-details.component.html',
  styleUrls: ['./admin-rooms-details.component.scss']
})
export class AdminRoomsDetailsComponent {
  hotelRooms: HotelRoom[] = []
  roomTypes: RoomType[] = []
  roomForm: FormGroup = new FormGroup({})
  newRoomForm: FormGroup = new FormGroup({})
  isFormEnabled: boolean = false
  selectedRoom: number = 0;
  hotelId: number = 0
  constructor(private hotelService: HotelService, private route: ActivatedRoute, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.getHotelRooms()
    this.newRoomForm = this.formBuilder.group({
      id: [],
      price: [],
      totalRooms: [],
      roomTypeId: [],
      hotelId: [this.hotelId],
      files: [[]]
    })
    console.log(this.newRoomForm.value)
  }
  
  getHotelRooms() {
    this.route.params.subscribe(params => {
      this.hotelId = params['hotelId'];
      this.hotelService.getRoomsInHotel(this.hotelId).subscribe(
        (response) => {
          this.hotelRooms = response
        })
    })
  }
  getRoomTypes() {
    this.hotelService.getRoomTypes().subscribe(
      (response) => {
        this.roomTypes = response
      }, (error) => {
        console.log(error)
      }
    )
  }
  getFirstImage(imageString: string): string {
    const images = imageString.split(',');
    return "https://localhost:7051" + images[0].trim();  // Trim any leading/trailing space
  }
  fillForm(room: HotelRoom) {
    this.isFormEnabled = true
    this.selectedRoom = room.id
    this.roomForm = this.formBuilder.group({
      id: [room.id],
      price: [room.price],
      totalRooms: [room.totalRooms],
      roomTypeId: [room.roomTypeId],
      hotelId: [this.hotelId]
    })
  }
  updateRoom() {
    const formData = new FormData();
    // Add your fields and files to the FormData object
    formData.append('id', this.roomForm.get('id')!.value)
    formData.append('price', this.roomForm.get('price')!.value);
    formData.append('totalRooms', this.roomForm.get('totalRooms')!.value);
    formData.append('roomTypeId', this.roomForm.get('roomTypeId')!.value);
    formData.append('hotelId', this.roomForm.get('hotelId')!.value);

    console.log(formData)

    this.hotelService.updateRoomInHotel(formData).subscribe(
      (response) => {
        Swal.fire("Room Updated Successfully")
        this.isFormEnabled = false
        this.getHotelRooms();
      },
      (error) => {
        console.log(error)
      })
  }
  addRoom() {
    const formData = new FormData();
    // Add your fields and files to the FormData object 
    formData.append('price', this.newRoomForm.get('price')!.value);
    formData.append('totalRooms', this.newRoomForm.get('totalRooms')!.value);
    formData.append('roomTypeId', this.newRoomForm.get('roomTypeId')!.value);
    formData.append('hotelId', this.newRoomForm.get('hotelId')!.value);
    const files: File[] = this.newRoomForm.get('files')?.value;

    if (files && files.length > 0) {
      for (const file of files) {
        formData.append('files', file, file.name);
      }
    }
    console.log(formData)

    this.hotelService.addRoomInHotel(formData).subscribe(
      (response) => {
        Swal.fire("Room Added Successfully")
        this.getHotelRooms();
        this.newRoomForm.reset()
        
      },
      (error) => {
        console.log(error)
      })
  }
  delete(id: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Delete Room?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hotelService.deletroomfromhotel(id).subscribe(
          (response) => {
            if(response == true){
              Swal.fire("Room Deleted Successfully");
              this.getHotelRooms()
              this.newRoomForm.reset()
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
  onFileChange(event: any) {
    
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
      this.newRoomForm.get('files')?.setValue(imageArray);

      console.log(this.newRoomForm.get('files')?.value);
    }
  }
}
