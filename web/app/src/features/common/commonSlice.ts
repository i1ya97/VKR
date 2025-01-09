import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';
import { WeatherForecast } from './models/WeatherForecast';

const initState: CommonState = {
  user: null,
  theme: 'dark',
  weatherForecasts: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Models.User<Models.Preferences> | null>) => {
      state.user = payload;
    },
    setTheme: (state, { payload }: PayloadAction<'dark' | 'light'>) => {
      state.theme = payload;
    },
    setWeatherForecasts: (state, { payload }: PayloadAction<WeatherForecast[]>) => {
      state.weatherForecasts = payload;
    },
  },
});

export const { setUser, setTheme, setWeatherForecasts } = commonSlice.actions;
