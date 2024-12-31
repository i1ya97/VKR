import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CommonState } from './models/CommonState';
import { SetDates } from './models/SetDates';

const initState: CommonState = {};

export const commonSlice = createSlice({
  name: 'common',
  initialState: initState,
  reducers: {
    setDates: (state, { payload }: PayloadAction<SetDates>) => {
      const { startDate, endDate } = payload;

      state.startDate = startDate;
      state.endDate = endDate;
    },
  },
});

export const {
  setDates,
} = commonSlice.actions;
