import { createAction, props } from '@ngrx/store';
import { ScreenSizes } from '../state/PreferencesState';

export const switchTheme = createAction('[Topbar Component] Switch theme', props<{ theme: string }>());
export const toggleSidenav = createAction('[Topbar Component] Toggle sidenav');
export const switchLanguage = createAction('[Sidenav Component] Switch language', props<{ language: string }>());
export const switchScreenSize = createAction('[App component] Switch screen size', props<{screenSize: ScreenSizes}>())