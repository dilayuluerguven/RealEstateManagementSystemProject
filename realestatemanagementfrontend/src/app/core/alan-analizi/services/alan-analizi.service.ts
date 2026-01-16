import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlanAnaliziService {

  private apiUrl = `${environment.baseUrl}/api/AlanAnaliz`;

  constructor(private http: HttpClient) {}

  geometriKaydet(kullaniciId: number, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/geometri-kaydet?kullaniciId=${kullaniciId}`, body);
  }

  kayitliGeometriler(kullaniciId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/geometriler?kullaniciId=${kullaniciId}`);
  }

  kesisim(kullaniciId: number, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/kesisim?kullaniciId=${kullaniciId}`, body);
  }

  birlesim(kullaniciId: number, body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/birlesim?kullaniciId=${kullaniciId}`, body);
  }

  tumAnalizler(kullaniciId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tum-analizler?kullaniciId=${kullaniciId}`);
  }
}
