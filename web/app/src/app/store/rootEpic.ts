import { combineEpics } from 'redux-observable';

import { ActionIn, ActionOut } from '@entities/store';

export const rootEpic = combineEpics<ActionIn, ActionOut, RootState>();
