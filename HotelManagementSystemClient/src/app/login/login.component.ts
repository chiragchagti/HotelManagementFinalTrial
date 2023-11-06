import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../classes/login';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { AuthRedirectService } from '../services/auth-redirect.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: Login = new Login();
  
  constructor(public loginService: LoginService, private router: Router, private authRedirectService: AuthRedirectService) { }
  ngOnInit(){
    if(this.loginService.isAuthenticated()){
      this.router.navigateByUrl('home');
    }
  }
  LoginClick() {

    this.loginService.CheckUser(this.user).subscribe(
      (response) => {
        if (this.authRedirectService.redirectUrl != "") {
          this.router.navigateByUrl(this.authRedirectService.redirectUrl, {state: this.authRedirectService.state});
          this.authRedirectService.clearRedirectUrl(); 
        } else {
          
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        Swal.fire("Wrong username or password");
        this.user.userName = "";
        this.user.password = ""
      }

    )
  }
}
