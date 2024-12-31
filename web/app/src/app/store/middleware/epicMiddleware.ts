import { createEpicMiddleware } from 'redux-observable';
import { ajax } from 'rxjs/ajax';

import { ActionIn, ActionOut } from '@entities/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const epicMiddleware = createEpicMiddleware<ActionIn, ActionOut, any>({
  dependencies: { getJSON: ajax.getJSON },
});
