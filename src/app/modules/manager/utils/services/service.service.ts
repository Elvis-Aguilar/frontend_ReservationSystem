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

  createBussinesConfig(service: ServiceDto): Observable<ServiceDto> {
    return this._http.post<ServiceDto>(`${this.apiConfig.API_SERVICES}`, service)
  }
}
