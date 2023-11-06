
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../classes/cart';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  redirectUrl: string ="";
  state:any
  constructor(private router: Router) { 

  }

  saveRedirectUrl(url:string) {
    this.redirectUrl = url;
    if(this.router.getCurrentNavigation()?.extras.state != null){
      this.state=   this.router.getCurrentNavigation()?.extras.state
      console.log(this.state)
    }
  }

  clearRedirectUrl() {
    this.redirectUrl = "";
  }
}
