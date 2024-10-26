import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { ApiConfigService } from "../../../../config/services/api-config.service"
import { Observable } from "rxjs"
import { AppointmentDto } from "../models/appointment.dto"

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    private readonly _http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfigService)

    constructor() { }

    createAppoinment(appointment: AppointmentDto): Observable<AppointmentDto> {
        return this._http.post<AppointmentDto>(`${this.apiConfig.API_APPOINTMENT}`, appointment)
    }

    getAllAppointment(): Observable<AppointmentDto[]> {
        return this._http.get<AppointmentDto[]>(`${this.apiConfig.API_APPOINTMENT}`)
    }

    completed(id:number): Observable<AppointmentDto> {
        return this._http.patch<AppointmentDto>(`${this.apiConfig.API_APPOINTMENT}/${id}`, "appointment")
    }

    canceled(id:number): Observable<AppointmentDto> {
        return this._http.patch<AppointmentDto>(`${this.apiConfig.API_APPOINTMENT}/canceled/${id}`, "appointment")
    }
}