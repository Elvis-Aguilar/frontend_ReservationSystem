import { HttpClient } from "@angular/common/http"
import { Injectable, inject } from "@angular/core"
import { ApiConfigService } from "../../../../config/services/api-config.service"
import { Observable } from "rxjs"
import { employeDto } from "../models/employes.dto"

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private readonly _http = inject(HttpClient)
    private readonly apiConfig = inject(ApiConfigService)

    constructor() { }

    getEmployees(): Observable<employeDto[]> {
        return this._http.get<employeDto[]>(`${this.apiConfig.API_USER}/role/3`)
    }

}