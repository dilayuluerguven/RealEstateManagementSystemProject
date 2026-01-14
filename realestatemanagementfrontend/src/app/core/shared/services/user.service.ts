import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../profile/api-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = '/api/user';

  constructor(private httpClient: HttpClient) {}

  updateProfile(payload: any) {
    return this.httpClient.put<ApiResponse>(
      `${environment.baseUrl}/api/Profile`,
      payload
    );
  }
}
