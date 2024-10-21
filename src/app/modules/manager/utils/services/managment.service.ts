import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../../../config/services/api-config.service';
import { Observable } from 'rxjs';
import { BusinessConfigurationDto } from '../models/business-congifuration.dto';
import { UploadImgService } from '../../../../config/services/upload-img.service';

@Injectable({
  providedIn: 'root'
})
export class ManagmentService {

  private readonly _http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfigService)

  constructor() { }

  createBussinesConfig(bussines: BusinessConfigurationDto): Observable<BusinessConfigurationDto> {
    return this._http.post<BusinessConfigurationDto>(`${this.apiConfig.API_BUSINESS_CONFIG}`, bussines)
  }

  updateBussinesConfig(id:number, bussines: BusinessConfigurationDto): Observable<BusinessConfigurationDto> {
    return this._http.put<BusinessConfigurationDto>(`${this.apiConfig.API_BUSINESS_CONFIG}/${id}`, bussines)
  }

  getBussinesConfiguration(): Observable<BusinessConfigurationDto> {
    return this._http.get<BusinessConfigurationDto>(`${this.apiConfig.API_BUSINESS_CONFIG}`)
  }
}
