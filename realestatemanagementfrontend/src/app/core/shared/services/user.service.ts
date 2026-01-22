import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../profile/api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}
  updateProfile(payload: any) {
    return this.httpClient.put<ApiResponse>(
      `${environment.baseUrl}/api/Profile`,
      payload
    );
  }
}
