import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { BookingComponent } from './booking/booking.component';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { LoginComponent } from './login/login.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AdminPanelComponent } from './admin/components/admin-panel/admin-panel.component';
import { AdminHotelsComponent } from './admin/components/admin-hotels/admin-hotels.component';
import {DataTablesModule} from 'angular-datatables';
import { AdminHotelDetailsComponent } from './admin/components/admin-hotel-details/admin-hotel-details.component';
import { AddHotelComponent } from './admin/components/add-hotel/add-hotel.component';
import { AdminRoomsDetailsComponent } from './admin/components/admin-rooms-details/admin-rooms-details.component';
import { AdminRoomTypesComponent } from './admin/components/admin-room-types/admin-room-types.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { RegisterComponent } from './register/register.component';
import { NgxStripeModule } from 'ngx-stripe';
import { env } from '../env';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HotelDetailsComponent,
    BookingComponent,
    LoginComponent,
    AdminPanelComponent,
    AdminHotelsComponent,
    AdminHotelDetailsComponent,
    AddHotelComponent,
    AdminRoomsDetailsComponent,
    AdminRoomTypesComponent,
    BookingConfirmationComponent,
    BookingsListComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MdbCarouselModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
NgxStripeModule.forRoot(env.stripe.publicKey),
    JwtModule.forRoot({
      config:{
        tokenGetter:()=>{
          return sessionStorage.getItem('currentUser')?
          JSON.parse(sessionStorage.getItem('currentUser') as string).token:null;
        }
      }
    }),
      BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi:true,     
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
