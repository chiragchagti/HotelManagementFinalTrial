import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HotelManagementSystemClient';
 currentUser = {role:''}
  constructor(public loginService:LoginService){
    var currentUserSession = sessionStorage.getItem("currentUser");
    if(currentUserSession!= null){
      this.currentUser=JSON.parse(currentUserSession)
      

    }
  }
  

  
  logOutClick(){
    this.loginService.Logout();
    
  }
}
