
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectService {
  redirectUrl: string ="";

  constructor(private router: Router) {}

  saveRedirectUrl(url:string) {
    this.redirectUrl = url;
    console.log(this.redirectUrl)
  }

  clearRedirectUrl() {
    this.redirectUrl = "";
  }
}
