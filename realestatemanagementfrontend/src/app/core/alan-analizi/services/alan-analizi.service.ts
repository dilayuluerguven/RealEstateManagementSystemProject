import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, AlanAnalizSonuc } from '../models/alan-analiz-sonuc';

@Injectable({
  providedIn: 'root'
})
export class AlanAnalizService {

  private apiUrl = 'https://localhost:7275/api/AlanAnaliz';

  constructor(private http: HttpClient) {}

  geometriKaydet(dto: {
    geometriAdi: string;
    geometriJson: string;
  }): Observable<ApiResponse<AlanAnalizSonuc>> {
    return this.http.post<ApiResponse<AlanAnalizSonuc>>(
      `${this.apiUrl}/geometri-kaydet`,
      dto
    );
  }

  kesisim(dto: {
    a: string;
    b: string;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/kesisim`,
      dto
    );
  }

  birlesimAB(): Observable<ApiResponse<AlanAnalizSonuc>> {
    return this.http.post<ApiResponse<AlanAnalizSonuc>>(
      `${this.apiUrl}/birlesim-ab`,
      {}
    );
  }

  birlesimABC(): Observable<ApiResponse<AlanAnalizSonuc>> {
    return this.http.post<ApiResponse<AlanAnalizSonuc>>(
      `${this.apiUrl}/birlesim-abc`,
      {}
    );
  }
}
