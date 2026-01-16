import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlanAnaliziService {

  private apiUrl = `${environment.baseUrl}/api/AlanAnaliz`;

  constructor(private http: HttpClient) {}

  geometriKaydet(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/geometri-kaydet`, body);
  }

  kesisim(a: string, b: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/kesisim`, { a, b });
  }

  birlesimAB(): Observable<any> {
    return this.http.post(`${this.apiUrl}/birlesim-ab`, {});
  }

  birlesimABC(): Observable<any> {
    return this.http.post(`${this.apiUrl}/birlesim-abc`, {});
  }
}
