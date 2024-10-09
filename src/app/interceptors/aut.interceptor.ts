import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store';

const excludedUrls: string[] = [
  '/sign-up',
  '/sign-in',
  '/sign-in/2fa',
  '/recover-password',
  '/companies',
]

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const store = inject(Store<AppState>);

  const shouldSkip = excludedUrls.some(url => req.url.includes(url))

  if (shouldSkip) {
    return next(req);
  }

  let session = JSON.parse(localStorage.getItem("session") || "{'accessToken': ''}")

  console.log('Agregando token: ' + session.accessToken);

  const reqWithHeaders = req.clone({
    setHeaders: {
      Authorization: `Bearer ${session.accessToken}`
    }
  })
  return next(reqWithHeaders);
};