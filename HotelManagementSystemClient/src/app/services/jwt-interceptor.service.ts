import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/env'

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var currentUser = {token:""};
    var currentUserSession = sessionStorage.getItem("currentUser");
    if(currentUserSession!= null){
      currentUser=JSON.parse(currentUserSession)
      
      req=req.clone({
        setHeaders:{
          Authorization: "Bearer " + currentUser.token
        }
      })
    }
    req=req.clone({ url: env.apiUrl+"/"+req.url} )
    
    return next.handle(req)
  }
}
