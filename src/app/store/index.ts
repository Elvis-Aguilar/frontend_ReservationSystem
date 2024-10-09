import { ActionReducerMap } from "@ngrx/store";
import { SessionState } from "./session/state/session.state";
import { sessionReducer } from "./session/reducers/session.reducers";
import { PreferencesState } from "./preferences/state/PreferencesState";
import { pereferencesReducer } from "./preferences/reducers/preferences.reducer";

export interface AppState {
    preferencesState: PreferencesState,
    sessionState: SessionState
}

export const reducers: ActionReducerMap<AppState> = {
    preferencesState: pereferencesReducer,
    sessionState: sessionReducer
}