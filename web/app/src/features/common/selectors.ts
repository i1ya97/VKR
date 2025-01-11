const commonModule = (state: RootState) => state.common;

export const selectUser = (state: RootState) => commonModule(state).user;

export const selectTheme = (state: RootState) => commonModule(state).theme;

export const selectOpenSideBar = (state: RootState) => commonModule(state).openSideBar;

export const selectOzonApiCredentions = (state: RootState) => commonModule(state).ozonApiCredentions;
