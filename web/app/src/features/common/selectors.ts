const commonModule = (state: RootState) => state.common;

export const selectUser = (state: RootState) => commonModule(state).user;

export const selectTheme = (state: RootState) => commonModule(state).theme;

export const selectWeatherForecasts = (state: RootState) => commonModule(state).weatherForecasts;

export const selectOpenSideBar = (state: RootState) => commonModule(state).openSideBar;
