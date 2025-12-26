import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasinmazService {
  constructor(private httpClient: HttpClient) {}
  getAll() {
    return this.httpClient.get<any[]>(`${environment.baseUrl}/api/Tasinmaz`);
  }

  add(data: any) {
    return this.httpClient.post(
      `${environment.baseUrl}/api/Tasinmaz/add`,
      data
    );
  }

  update(id: number, data: any) {
    return this.httpClient.put(
      `${environment.baseUrl}/api/Tasinmaz/update/${id}`,
      data
    );
  }
}
