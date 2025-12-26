import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }
  login(email: string, password: string):Observable<any>
  {
    const body={
      email:email,
      sifre:password
    };
    return this.httpClient.post<any>(`${environment.baseUrl}/api/Auth/login`, body);
  }
}

