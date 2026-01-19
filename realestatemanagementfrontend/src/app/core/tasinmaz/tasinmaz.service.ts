import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TasinmazList } from './models/tasinmaz-list';
import { TasinmazCreateUpdate } from './models/tasinmaz-create-update';

@Injectable({
  providedIn: 'root'
})
export class TasinmazService {
  private apiUrl = `${environment.baseUrl}/api/Tasinmaz`;

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<TasinmazList[]> {
    return this.httpClient.get<TasinmazList[]>(this.apiUrl);
  }

  getById(id: number): Observable<TasinmazCreateUpdate> {
    return this.httpClient.get<TasinmazCreateUpdate>(`${this.apiUrl}/${id}`);
  }

  add(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/add`, formData);
  }

  update(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/update/${id}`, formData);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/delete/${id}`);
  }

  getImage(id: number): string {
    return `${this.apiUrl}/${id}/image`;
  }
}
