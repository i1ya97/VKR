import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux';

import { epicMiddleware } from './middleware/epicMiddleware';
import { rootEpic } from './rootEpic';
import { rootReducer } from './rootReducer';

const storeActivate = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (storeEnhancer) => storeEnhancer().concat(applyMiddleware(epicMiddleware)),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  epicMiddleware.run(rootEpic);
  return store;
};

export const store = storeActivate();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
