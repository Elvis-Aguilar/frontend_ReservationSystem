
export const enum ScreenSizes{
    MOBILE,
    TABLET,
    DESKTOP
}

export interface PreferencesState {
    theme: string,
    sidenavCollapsed: boolean
    language: string,
    screenSize: ScreenSizes
}

export const initialPreferencesState: PreferencesState = {
    theme: "light",
    sidenavCollapsed: false,
    language: "es",
    screenSize: ScreenSizes.DESKTOP
}
