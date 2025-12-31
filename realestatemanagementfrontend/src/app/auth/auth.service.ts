import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      sifre: password,
    };

    return this.httpClient.post<any>(
      `${environment.baseUrl}/api/Auth/login`,
      body
    );
  }

  register(
    adSoyad: string,
    email: string,
    password: string,
    rol: string
  ): Observable<any> {
    const body = {
      adSoyad: adSoyad,
      email: email,
      sifre: password,
      rol: rol,
    };

    return this.httpClient.post(
      `${environment.baseUrl}/api/Auth/register`,
      body,
      { responseType: 'text' }
    );
  }
}
