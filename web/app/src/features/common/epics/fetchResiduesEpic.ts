import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, throwError } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { ActionOut } from '@entities/store';
import { setDateEnd, setDateStart, setResidues } from '../commonSlice';

export const action = createAction('common/fetchResidues');

export const fetchResiduesEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(action.type, setDateStart.type, setDateEnd.type),
    mergeMap(() => {
      const { dateStart, dateEnd } = state$.value.common;

      const params = new URLSearchParams();
      if (dateStart) params.append('startDate', dateStart.startOf('day').toISOString());
      if (dateEnd) params.append('endDate', dateEnd.startOf('day').toISOString());

      return from(request<Record<string, string>[]>(ApiMethods.GET, `/api`, `/Residues?${params.toString()}`)
      ).pipe(
        map((res) => {
          return res?.data ?? [];
        }),
        catchError((error) => throwError(() => error)),
      );
    }),
    map((result) => {
      const { dateStart, dateEnd } = state$.value.common;
      if (dateStart && dateEnd) {
        const difference = dateEnd.diff(dateStart, "day");
        return setResidues({ rows: result.map((r) => ({ ...r, count_days: difference.toString() })), loading: false }) as ActionOut;
      }
      return setResidues({ rows: result, loading: false }) as ActionOut;
    }),
  );
};
