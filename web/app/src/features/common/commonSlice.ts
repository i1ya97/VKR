import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';
import { WeatherForecast } from './models/WeatherForecast';
import { UserOptions } from './models/UserOptions';
import { ApiCredentions } from './models/ApiCredentions';

const initState: CommonState = {
  user: null,
  theme: { id: '', value: 'light' },
  openSideBar: { id: '', value: true },
  ozonApiCredentions: null,
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
    setOzonApiCredentions: (state, { payload }: PayloadAction<ApiCredentions>) => {
      state.ozonApiCredentions = payload;
    },
    setOpenSideBar: (state, { payload }: PayloadAction<boolean>) => {
      state.openSideBar.value = payload;
    },
  },
});

export const { setUser, setTheme, setUserOptions, setOpenSideBar, setOzonApiCredentions } = commonSlice.actions;
