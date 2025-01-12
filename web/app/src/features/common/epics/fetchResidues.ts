import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, throwError } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { ActionOut } from '@entities/store';
import { setResidues } from '../commonSlice';
import dayjs from 'dayjs';

export const action = createAction('common/fetchResidues');

export const fetchResiduesEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(action.type),
    mergeMap(() => {
      return from(request<Record<string, string>[]>(ApiMethods.GET, `/api`, `/Residues?startDate=${dayjs.utc().add(-14, 'day').toISOString()}&endDate=${dayjs.utc().toISOString()}`)).pipe(
        map((res) => {
          return res?.data ?? [];
        }),
        catchError((error) => throwError(() => error)),
      );
    }),
    map((result) => {
      return setResidues(result) as ActionOut;
    }),
  );
};
