import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';
import { UserOptions } from './models/UserOptions';
import { ApiCredentions } from './models/ApiCredentions';
import { TableData } from './models/TableData';
import dayjs from 'dayjs';

const initState: CommonState = {
  user: null,
  theme: { id: '', value: 'light' },
  openSideBar: { id: '', value: true },
  ozonApiCredentions: null,
  dateStart: null,
  dateEnd: null,
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
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Models.User<Models.Preferences> | null>) => {
      state.user = payload;
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
    setDateStart: (state, { payload }: PayloadAction<dayjs.Dayjs| null>) => {
      state.dateStart = payload;
    },
    setDateEnd: (state, { payload }: PayloadAction<dayjs.Dayjs| null>) => {
      state.dateEnd = payload;
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
  setUser, setTheme, setUserOptions, setOpenSideBar,setOzonApiCredentions, 
  setUploadLogs, setArticles, setResidues, setDateStart, setDateEnd
} = commonSlice.actions;
