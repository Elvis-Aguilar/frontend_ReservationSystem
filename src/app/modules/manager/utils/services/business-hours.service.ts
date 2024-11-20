import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { ApiConfigService } from "../../../../config/services/api-config.service"
import { BusinessHour, UpdateUserBusinessHours, UserHoursDto } from "../models/business-hours.dto"
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursService {

  private readonly _http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfigService)

  constructor() { }

  getBussinesConfiguration(): Observable<BusinessHour[]> {
    return this._http.get<BusinessHour[]>(`${this.apiConfig.API_BUSINESS_HOURS}/all-general`)
  }

  getHoursBusinessSpecificDate(): Observable<BusinessHour[]> {
    return this._http.get<BusinessHour[]>(`${this.apiConfig.API_BUSINESS_HOURS}/all-specific`)
  }

  UpdateBussinesHourt(buss: BusinessHour, id: number): Observable<BusinessHour> {
    return this._http.put<BusinessHour>(`${this.apiConfig.API_BUSINESS_HOURS}/${id}`, buss)
  }

  createdBusinessHours(buss: BusinessHour): Observable<BusinessHour> {
    return this._http.post<BusinessHour>(`${this.apiConfig.API_BUSINESS_HOURS}`, buss)
  }

  getUserBusinessHours(hoursId: number): Observable<UserHoursDto[]>{
    return this._http.get<UserHoursDto[]>(`${this.apiConfig.API_BUSINESS_HOURS}/users/${hoursId}`)
  }

  UpdateUserBussinesHours(buss: UpdateUserBusinessHours, id: number): Observable<BusinessHour> {
    return this._http.put<BusinessHour>(`${this.apiConfig.API_BUSINESS_HOURS}/users/${id}`, buss)
  }
}