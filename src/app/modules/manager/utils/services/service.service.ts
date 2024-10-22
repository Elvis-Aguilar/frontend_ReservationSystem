import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../../../config/services/api-config.service';
import { ServiceDto } from '../models/service.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private readonly _http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfigService)

  constructor() { }

  createService(service: ServiceDto): Observable<ServiceDto> {
    return this._http.post<ServiceDto>(`${this.apiConfig.API_SERVICES}`, service)
  }

  getServicesAvailable():Observable<ServiceDto[]> {
    return this._http.get<ServiceDto[]>(`${this.apiConfig.API_SERVICES}/available`)
  }

  getServicesUnAvailable():Observable<ServiceDto[]> {
    return this._http.get<ServiceDto[]>(`${this.apiConfig.API_SERVICES}/unavailable`)
  }

  getServiceById(id:number):Observable<ServiceDto> {
    return this._http.get<ServiceDto>(`${this.apiConfig.API_SERVICES}/${id}`)
  }

  updateService(id:number, serviceDto:ServiceDto): Observable<ServiceDto> {
    return this._http.put<ServiceDto>(`${this.apiConfig.API_SERVICES}/${id}`, serviceDto)
  }

  deleted(id:number): Observable<any> {
    return this._http.delete<any>(`${this.apiConfig.API_SERVICES}/${id}`)
  }
  
}
