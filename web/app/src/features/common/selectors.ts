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

export const selectDashboardDateStart = (state: RootState) => commonModule(state).dashboardDateStart;

export const selectDashboardDateEnd = (state: RootState) => commonModule(state).dashboardDateEnd;

export const selectDashboardChart = (state: RootState) => commonModule(state).dashboardChart;

export const selectPluginsConfig = (state: RootState) => commonModule(state).pluginsConfig;
