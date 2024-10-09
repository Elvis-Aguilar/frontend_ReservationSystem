import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiConfigService } from '../../config/services/api-config.service';
import { SignUpDto, TokenDto, UserDto } from '../interfaces/auth-sesion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthSesionService {

  private readonly _http = inject(HttpClient)
  private readonly apiConfig = inject(ApiConfigService)

  constructor() { }

  signUp(signUpDto: SignUpDto): Observable<UserDto> {
    return this._http.post<UserDto>(`${this.apiConfig.API_AUTH}/sign-up`, signUpDto)
  }

  signUpConfirmation(email: string, code: string): Observable<any> {
    return this._http.put<TokenDto>(`${this.apiConfig.API_AUTH}/sign-up`, { email, code })
  }

  getMFA() {
    return this._http.get<any>(`${this.apiConfig.API_USER}/multifactor-authentication`)
  }

  enableMFA(code: number, authKey: string) {
    return this._http.patch<any>(`${this.apiConfig.API_USER}/multifactor-authentication`, { code, authKey })
  }



}
