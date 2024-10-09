import { createAction, props } from "@ngrx/store";
import { SessionState } from "../state/session.state";

export const setSession = createAction('[General] Set Session', props<{ session: SessionState }>());
export const signOut = createAction('[General] signOut')