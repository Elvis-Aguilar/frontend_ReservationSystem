import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { setSession, signOut } from "../actions/session.actions";
import { tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class SessionEffect {
    actions$ = inject(Actions)
    router = inject(Router)

    setSessionEffect = createEffect(() => this.actions$.pipe(
        ofType(setSession),
        tap(({ session }) => {
            localStorage.setItem('session', JSON.stringify(session))
        })
    ), { dispatch: false })

    signOutEffect = createEffect(() => this.actions$.pipe(
        ofType(signOut),
        tap(() => {
            localStorage.removeItem('session')
            localStorage.removeItem('current_user')
            this.router.navigate(['session/login'])
        })
    ), { dispatch: false })

}