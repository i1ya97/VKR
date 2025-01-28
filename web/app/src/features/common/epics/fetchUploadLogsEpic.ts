import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, throwError } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { ActionOut } from '@entities/store';
import { setUploadLogs } from '../commonSlice';

export const action = createAction('common/fetchUploadLogs');

export const fetchUploadLogsEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(action.type),
    mergeMap(() => {
      return from(request<Record<string, string>[]>(ApiMethods.GET, `/api`, `/Logs`)).pipe(
        map((res) => {
          return (res?.data ?? []).sort((a, b) => b.due_date.localeCompare(a.due_date));
        }),
        catchError((error) => throwError(() => error)),
      );
    }),
    map((result) => {
      return setUploadLogs({rows: result, loading: false}) as ActionOut;
    }),
  );
};
