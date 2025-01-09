import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, catchError, from, map, mergeMap, of, throwError } from 'rxjs';

import { ActionOut } from '@entities/store';
import { ApiMethods, request } from '@shared/api';
import { WeatherForecast } from '../models/WeatherForecast';
import { setWeatherForecasts } from '../commonSlice';

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
      return setWeatherForecasts(result) as ActionOut;
    }),
  );
};
