import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/env';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private httpClient:HttpClient) { }

  getAllCities():Observable<any>{
    return this.httpClient.get<any>(env.apiUrl+"/api/Home/cities")
  }
  getAllStates():Observable<any>{
    return this.httpClient.get<any>(env.apiUrl+"/api/Home/states")
  }

}
