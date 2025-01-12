import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, throwError } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { ActionOut } from '@entities/store';
import { setArticles } from '../commonSlice';

export const action = createAction('common/fetchArticles');

export const fetchArticlesEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(action.type),
    mergeMap(() => {
      return from(request<Record<string, string>[]>(ApiMethods.GET, `/api`, `/Products`)).pipe(
        map((res) => {
          return res?.data ?? [];
        }),
        catchError((error) => throwError(() => error)),
      );
    }),
    map((result) => {
      return setArticles(result) as ActionOut;
    }),
  );
};
