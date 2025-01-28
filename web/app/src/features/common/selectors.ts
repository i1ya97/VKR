const commonModule = (state: RootState) => state.common;

export const selectUser = (state: RootState) => commonModule(state).user;

export const selectTheme = (state: RootState) => commonModule(state).theme;

export const selectOpenSideBar = (state: RootState) => commonModule(state).openSideBar;

export const selectOzonApiCredentions = (state: RootState) => commonModule(state).ozonApiCredentions;

export const selectUploadLogs = (state: RootState) => commonModule(state).uploadLogs;

export const selectArticles = (state: RootState) => commonModule(state).articles;

export const selectResidues = (state: RootState) => commonModule(state).residues;

export const selectDateStart = (state: RootState) => commonModule(state).dateStart;

export const selectDateEnd = (state: RootState) => commonModule(state).dateEnd;
