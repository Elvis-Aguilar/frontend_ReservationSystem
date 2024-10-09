import { createSelector } from "@ngrx/store";
import { AppState } from "../..";
import { PreferencesState } from "../state/PreferencesState";

export const selectPreferencesState = (state: AppState) => state.preferencesState;

export const selectSidenavCollapsed = createSelector(
    selectPreferencesState,
    (state: PreferencesState) => state.sidenavCollapsed
);

export const selectTheme = createSelector(
    selectPreferencesState,
    (state: PreferencesState) => state.theme
);

export const selecScreenSize = createSelector(
    selectPreferencesState,
    (state: PreferencesState) => state.screenSize
);