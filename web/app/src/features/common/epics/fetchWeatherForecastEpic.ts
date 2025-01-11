import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, throwError } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { WeatherForecast } from '../models/WeatherForecast';

export const action = createAction('common/fetchWeatherForecast');

export const fetchWeatherForecastEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(action.type),
    mergeMap(() => {
      return from(request<WeatherForecast[]>(ApiMethods.GET, `/api`, `/WeatherForecast`)).pipe(
        map((res) => {
          return res?.data ?? [];
        }),
        catchError((error) => throwError(() => error)),
      );
    }),
    map((result) => {
      return null;
    }),
  );
};
