import { combineEpics } from 'redux-observable';

import { ActionIn, ActionOut } from '@entities/store';
import { commonEpics } from '@features/common';

export const rootEpic = combineEpics<ActionIn, ActionOut, RootState>(...commonEpics);
