import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { ApiConfigService } from "../../../../config/services/api-config.service"
import { BusinessHour } from "../models/business-hours.dto"
import { Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
  })
  export class BusinessHoursService {
  
    private readonly _http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfigService)
  
    constructor() { }
  
    getBussinesConfiguration(): Observable<BusinessHour[]> {
      return this._http.get<BusinessHour[]>(`${this.apiConfig.API_BUSINESS_HOURS}`)
    }

    UpdateBussinesHourt(buss: BusinessHour, id:number): Observable<BusinessHour> {
      return this._http.put<BusinessHour>(`${this.apiConfig.API_BUSINESS_HOURS}/${id}`,buss)
    }
  }