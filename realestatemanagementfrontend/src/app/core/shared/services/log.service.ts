import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private baseUrl = environment.baseUrl + '/api/log';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }
  delete(id:number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
