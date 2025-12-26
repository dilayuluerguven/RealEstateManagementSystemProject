import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private httpClient:HttpClient) { }
  getIller(){
    return this.httpClient.get<any[]>(`${environment.baseUrl}/api/Il/getAll`);
  }
  getIlceler(ilId: number){
    return this.httpClient.get<any[]>(`${environment.baseUrl}/api/Ilce/getIlceByIlId/${ilId}`);
  }
   getMahalleler(ilceId: number){
    return this.httpClient.get<any[]>(`${environment.baseUrl}/api/Mahalle/getMahalleByIlceId/${ilceId}`);
  }
}
