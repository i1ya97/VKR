import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';
import { WeatherForecast } from './models/WeatherForecast';
import { UserOptions } from './models/UserOptions';

const initState: CommonState = {
  user: null,
  theme: { id: '', value: 'light' },
  weatherForecasts: [],
  openSideBar: { id: '', value: true },
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
    setOpenSideBar: (state, { payload }: PayloadAction<boolean>) => {
      state.openSideBar.value = payload;
    },
    setWeatherForecasts: (state, { payload }: PayloadAction<WeatherForecast[]>) => {
      state.weatherForecasts = payload;
    },
  },
});

export const { setUser, setTheme, setWeatherForecasts, setUserOptions, setOpenSideBar } = commonSlice.actions;
