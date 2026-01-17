import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlanAnalizCreate } from '../models/alan-analiz-create';
import { AlanAnalizSonuc, ApiResponse } from '../models/alan-analiz-sonuc';

@Injectable({
  providedIn: 'root'
})
export class AlanAnalizService {

  private readonly apiUrl = 'https://localhost:7275/api/alananaliz';

  constructor(private http: HttpClient) {}

  kaydet(dto: AlanAnalizCreate): Observable<ApiResponse<AlanAnalizSonuc>> {
    return this.http.post<ApiResponse<AlanAnalizSonuc>>(`${this.apiUrl}/kaydet`, dto);
  }

  getir(geometriAdi: string): Observable<ApiResponse<AlanAnalizSonuc>> {
    return this.http.get<ApiResponse<AlanAnalizSonuc>>(`${this.apiUrl}/getir/${geometriAdi}`);
  }

  liste(): Observable<ApiResponse<AlanAnalizSonuc[]>> {
    return this.http.get<ApiResponse<AlanAnalizSonuc[]>>(`${this.apiUrl}/liste`);
  }

  sil(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/sil/${id}`);
  }

  temizle(geometriAdi: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/temizle/${geometriAdi}`);
  }
}