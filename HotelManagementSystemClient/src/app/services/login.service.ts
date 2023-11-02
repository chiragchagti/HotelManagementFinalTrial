import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from '../classes/login';
import { env } from 'src/env';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

currentUserName:string=""
role =''
currentUser = {role:""};
  constructor(private httpClient:HttpClient, private router:Router,
    private jwtHelperService:JwtHelperService
    ) { }

    CheckUser(login:Login):Observable<any>{
      return this.httpClient.post<any>(env.apiUrl + "/api/Account/authenticate", login).pipe(map(u=>{
        if(u){
          this.currentUserName=u.userName;
         
          sessionStorage["currentUser"]=JSON.stringify(u);
          
          var currentUserSession = sessionStorage.getItem("currentUser");
          if(currentUserSession!= null){
            this.currentUser=JSON.parse(currentUserSession)
            this.role = this.currentUser.role
            console.log(this.role)
          }
        }
        return null;
      }))
    }
    Logout(){
      this.currentUserName="";
      sessionStorage.removeItem('currentUser')
      this.router.navigateByUrl("/login");
    }
  
    public isAuthenticated():boolean{
      if(this.jwtHelperService.isTokenExpired()){
        return false;
      }
      else{
        
        return true;}
    }
    register(formData:FormData){
      return this.httpClient.post<any>(env.apiUrl + "/api/Account/register", formData).pipe(map(u=>{
        if(u){
          this.currentUserName=u.userName;
         
          sessionStorage["currentUser"]=JSON.stringify(u);
          
          var currentUserSession = sessionStorage.getItem("currentUser");
          if(currentUserSession!= null){
            this.currentUser=JSON.parse(currentUserSession)
            this.role = this.currentUser.role
            console.log(this.role)
          }
        }
        return null;
      }))
    
    }
}
