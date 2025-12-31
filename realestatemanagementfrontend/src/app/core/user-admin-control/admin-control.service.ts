import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminControlService {
  constructor(private httpClient: HttpClient) {}

  getUsers() {
    return this.httpClient.get<any[]>(`${environment.baseUrl}/api/User`);
  }
  getUserById(id: number) {
  return this.httpClient.get<any>(
    `${environment.baseUrl}/api/User/${id}`
  );
}


 deleteUser(id: number) {
  return this.httpClient.delete<any>(
    `${environment.baseUrl}/api/User/${id}`
  );
}

  createUser(data: any) {
    return this.httpClient.post(`${environment.baseUrl}/api/User`, data, {
      responseType: 'text',
    });
  }
  updateUser(data:any,id:number)
  {
    return this.httpClient.put(`${environment.baseUrl}/api/User/${id}`,data,{responseType:'text'})
  }
}
