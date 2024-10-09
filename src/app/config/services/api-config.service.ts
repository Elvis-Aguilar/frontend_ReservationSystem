import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ApiConfigService {

    API_BASE = environment.apiUrl

    //Session module
    API_AUTH = `${this.API_BASE}/auth`
    API_USER = `${this.API_BASE}/users`
   
}