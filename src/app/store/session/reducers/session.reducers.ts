import { createReducer, on } from "@ngrx/store";
import { initialSessionState } from "../state/session.state";
import { setSession } from "../actions/session.actions";

export const sessionReducer = createReducer(
    initialSessionState,
    on(setSession, (state, { session }) => ({ ...state, ...session })),
);