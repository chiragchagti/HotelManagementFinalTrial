import { Component, ViewChild } from '@angular/core';
import { Booking } from '../classes/booking';
import { BookingService } from '../services/booking.service';
import { error } from 'jquery';
import { DataTableDirective } from 'angular-datatables';
import { Subject, raceWith } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  isDtInitialized: boolean = false;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  bookings: Booking[] = []
  currentUser = { id: '', role: '' }
page:number =1
  constructor(private bookingService: BookingService, private router: Router) { }
  ngOnInit() {
    this.getBookings()
  }

  getBookings() {
    var currentUserSession = sessionStorage.getItem("currentUser");
    if (currentUserSession != null) {
      this.currentUser = JSON.parse(currentUserSession)
    }
    if (this.currentUser.role == 'Super Admin') {
      this.bookingService.getBookingsAdmin(this.page).subscribe(
        (response) => {
          this.bookings = response
          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next(this.bookings);
            });
          }
          else {
            this.isDtInitialized = true;
            this.dtTrigger.next(this.bookings);
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
    
    else {
      this.bookingService.getBookings(this.currentUser.id, this.page).subscribe(
        (response) => {
          this.bookings = response
          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next(this.bookings);
            });
          }
          else {
            this.isDtInitialized = true;
            this.dtTrigger.next(this.bookings);
          }
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }
numSequence(): Array<number> { 
    return Array(this.bookings[0].pageCount); 
  }
  // cancel(id:number) {
  //   Swal.fire({
  //     title: 'Confirmation',
  //     text: 'Delete Hotel?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //      }


  //     else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // User clicked "No" or closed the dialog
  //       // Put your code for the "No" action here

  //     }
  //   });
  // }

  exportExcel(): void 
    {
      const filteredRecords= this.bookings.map(
        x => ({
          name: x.applicationUser.name,
          checkInDate: x.checkInDate,
          checkOutDatw: x.checkOutDate,
          adults: x.adults,
          children: x.children,
          price: x.priceWithGst,
          hotel: x.hotelRoom.hotel.name,
          roomType: x.hotelRoom.roomType.name,
          bookingStatus: x.bookingStatus

        })
      )
       /* table id is passed over here */   
      //  let element = document.getElementById('bookings'); 
       const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(filteredRecords);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, 'data.xlsx');
			
    }
  reprint(booking: Booking) {

    this.router.navigateByUrl('/bookingconfirmation', { state: booking });
  }
pagination(i:number){
    this.page = i
    this.getBookings()
  }
}
