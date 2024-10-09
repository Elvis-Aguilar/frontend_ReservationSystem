import { createReducer, on } from '@ngrx/store';
import { initialPreferencesState } from '../state/PreferencesState';
import { switchLanguage, switchScreenSize, switchTheme, toggleSidenav } from '../actions/preferences.actions';

export const pereferencesReducer = createReducer(
    initialPreferencesState,
    on(switchTheme, (state, { theme }) => ({ ...state, theme })),
    on(toggleSidenav, (state) => ({ ...state, sidenavCollapsed: !state.sidenavCollapsed })),
    on(switchLanguage, (state, { language }) => ({ ...state, language })),
    on(switchScreenSize, (state, { screenSize }) => ({ ...state, screenSize }))
);