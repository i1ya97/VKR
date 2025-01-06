import { combineReducers } from '@reduxjs/toolkit';

import { commonSlice } from '@features/common';

export const rootReducer = combineReducers({
  common: commonSlice.reducer,
});
