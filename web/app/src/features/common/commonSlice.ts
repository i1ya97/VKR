import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';
import { UserOptions } from './models/UserOptions';
import { ApiCredentions } from './models/ApiCredentions';
import { TableData } from './models/TableData';
import dayjs from 'dayjs';
import { DashboardChart } from './models/DashboardChart';
import { PluginOption } from '@shared/models/Plugin';

const initState: CommonState = {
  user: null,
  theme: { id: '', value: 'light' },
  openSideBar: { id: '', value: true },
  ozonApiCredentions: null,
  dateStart: null,
  dateEnd: null,
  dashboardDateStart: null,
  dashboardDateEnd: null,
  dashboardChart: { loading: false },
  uploadLogs: {
    loading: true,
    rows: [],
  },
  articles: {
    loading: true,
    rows: [],
  },
  residues: {
    loading: true,
    rows: [],
  },
  pluginsConfig: {
    id: '',
    plugins: [],
    pluginsTimeSeries: [],
  }
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Models.User<Models.Preferences> | null>) => {
      state.user = payload;
      state.dateStart = dayjs.utc().add(-14, 'day').startOf('day');
      state.dateEnd = dayjs.utc().startOf('day');
      state.dashboardDateStart = dayjs.utc().add(-7, 'day').startOf('day');
      state.dashboardDateEnd = dayjs.utc().startOf('day');
    },
    setTheme: (state, { payload }: PayloadAction<'dark' | 'light'>) => {
      state.theme.value = payload;
    },
    setUserOptions: (
      state,
      { payload }: PayloadAction<{ activeTheme: UserOptions<'dark' | 'light'>; openSideBar: UserOptions<boolean> }>,
    ) => {
      state.theme = payload.activeTheme;
      state.openSideBar = payload.openSideBar;
    },
    setUploadLogs: (state, { payload }: PayloadAction<TableData>) => {
      state.uploadLogs = payload;
    },
    setDateStart: (state, { payload }: PayloadAction<dayjs.Dayjs | null>) => {
      state.dateStart = payload;
    },
    setPluginsConfig: (state, { payload }: PayloadAction<{
      id: string,
      plugins: PluginOption[],
      pluginsTimeSeries: PluginOption[],
    }>) => {
      state.pluginsConfig = payload;
    },
    setDashboardChart: (state, { payload }: PayloadAction<DashboardChart>) => {
      state.dashboardChart = payload;
    },
    setDateEnd: (state, { payload }: PayloadAction<dayjs.Dayjs | null>) => {
      state.dateEnd = payload;
    },
    setDashboardDateStart: (state, { payload }: PayloadAction<dayjs.Dayjs | null>) => {
      state.dashboardDateStart = payload;
    },
    setDashboardDateEnd: (state, { payload }: PayloadAction<dayjs.Dayjs | null>) => {
      state.dashboardDateEnd = payload;
    },
    setArticles: (state, { payload }: PayloadAction<TableData>) => {
      state.articles = payload;
    },
    setResidues: (state, { payload }: PayloadAction<TableData>) => {
      state.residues = payload;
    },
    setOzonApiCredentions: (state, { payload }: PayloadAction<ApiCredentions>) => {
      state.ozonApiCredentions = payload;
    },
    setOpenSideBar: (state, { payload }: PayloadAction<boolean>) => {
      state.openSideBar.value = payload;
    },
  },
});

export const {
  setUser, setTheme, setUserOptions, setOpenSideBar, setOzonApiCredentions, setDashboardChart, setPluginsConfig,
  setUploadLogs, setArticles, setResidues, setDateStart, setDateEnd, setDashboardDateStart, setDashboardDateEnd
} = commonSlice.actions;
