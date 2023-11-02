import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { ActivateguardService } from './services/activateguard.service';
import { LoginComponent } from './login/login.component';
import { BookingComponent } from './booking/booking.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminHotelDetailsComponent } from './admin-hotel-details/admin-hotel-details.component';
import { AdminHotelsComponent } from './admin-hotels/admin-hotels.component';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { AdminRoomsDetailsComponent } from './admin-rooms-details/admin-rooms-details.component';
import { AdminRoomTypesComponent } from './admin-room-types/admin-room-types.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "details/:id", component: HotelDetailsComponent },
  { path: "booking/:selectedRoom/:rooms/:adults/:children", component: BookingComponent, canActivate: [ActivateguardService] },
  { path: "login", component: LoginComponent },
  {
    path: 'admin',
    component: AdminPanelComponent, canActivate: [ActivateguardService], data: {
      role: 'Super Admin'
    }, // Your parent component
    children: [
      { path: 'hotels', component: AdminHotelsComponent },
      { path: 'roomtypes', component: AdminRoomTypesComponent },
      { path: 'bookings', component: BookingsListComponent },// Child route for Hotels
    ],
  },
  {
    path: "hoteldetails/:id", component: AdminHotelDetailsComponent, canActivate: [ActivateguardService], data: {
      role: 'Super Admin'
    }
  },
  {
    path: "addhotel", component: AddHotelComponent, canActivate: [ActivateguardService], data: {
      role: 'Super Admin'
    }
  },
  {
    path: "roomsdetails/:hotelId", component: AdminRoomsDetailsComponent, canActivate: [ActivateguardService], data: {
      role: 'Super Admin'
    }
  },
  { path: "bookingconfirmation", component: BookingConfirmationComponent, canActivate: [ActivateguardService] },
  { path: "bookings", component: BookingsListComponent, canActivate: [ActivateguardService] },
  { path: "register", component: RegisterComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
