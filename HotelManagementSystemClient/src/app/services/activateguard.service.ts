import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { AuthRedirectService } from './auth-redirect.service';


@Injectable({
  providedIn: 'root'
})
export class ActivateguardService implements CanActivate {
  public currentUser = {role:""};
  constructor(private loginService:LoginService, private router:Router, private JwtHelperService:JwtHelperService, private authRedirectService: AuthRedirectService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(this.loginService.isAuthenticated()){
     
      var currentUserSession = sessionStorage.getItem("currentUser");
      if(currentUserSession!= null){
        this.currentUser=JSON.parse(currentUserSession)
 
      }
      if (route.data['role'] && route.data['role'].indexOf(this.currentUser.role) === -1) {
        Swal.fire('You are not authorized!!');
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }
    
    else{
      Swal.fire("Login to continue booking..");
      this.authRedirectService.saveRedirectUrl(state.url);
      this.router.navigate(['/login']);
      return false;
    }
    
    
  }
}
