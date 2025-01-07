import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { Models } from 'appwrite';

const initState: CommonState = {
  user: null,
  theme: 'dark',
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
  },
});

export const {
  setUser,
  setTheme,
} = commonSlice.actions;
