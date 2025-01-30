import { Action } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { EMPTY, Observable, catchError, filter, from, map, mergeMap } from 'rxjs';

import { ApiMethods, request } from '@shared/api';
import { setArticles, setDashboardChart, setDashboardDateEnd, setDashboardDateStart } from '../commonSlice';
import { TimeSeries } from '@widgets/Forecasting/ui/ForecastingChart/utils/findMinMaxKeys';
import { BarInfo } from '@shared/charts';
import { ActionOut } from '@entities/store';
import { HistogramData } from '@shared/charts/models/HistogramData';
import { generateRandomHexColor } from '@shared/utils/generateRandomHexColor';

export const fetchDashboardEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(setArticles.type, setDashboardDateStart.type, setDashboardDateEnd.type),
    filter(() => {
      const { articles } = state$.value.common;
      return !!articles.rows.length
    }),
    mergeMap(() => {
      const { articles, dashboardDateStart, dashboardDateEnd } = state$.value.common;
      return from(request<TimeSeries>(ApiMethods.POST, `/api`, `/TimeSeries`, {
        productIds: articles.rows.map((p) => p.id),
        curves: ['ordered_units'],
        startDate: dashboardDateStart ? dashboardDateStart.toISOString() : undefined,
        endDate: dashboardDateEnd ? dashboardDateEnd.toISOString() : undefined,
      })).pipe(
        map((res) => res?.data ?? {}),
        catchError(() => EMPTY),
      );
    }),
    map((sales) => {
      const { articles, dashboardDateStart, dashboardDateEnd } = state$.value.common;
      if (!dashboardDateEnd || !dashboardDateStart) {
        return setDashboardChart({ loading: false }) as ActionOut;
      }

      const points = Object.values(sales)
        .flatMap((sale) => Object.values(sale))
        .flatMap((pointArray) => pointArray);

      const pointsMap: Record<string, number> = points.reduce((map, point) => {
        if (map[point.key]) {
          map[point.key] += point.value;
        } else {
          map[point.key] = point.value;
        }
        return map;
      }, {} as Record<string, number>);

      const data: HistogramData = { groupKey: '' };
      const barsInfo: BarInfo = {};

      const totalDays = dashboardDateEnd.diff(dashboardDateStart, 'day');

      const dateRange = Array.from({ length: totalDays + 1 }, (_, index) =>
        dashboardDateStart.add(index, 'day')
      );

      dateRange.forEach((date, index) => {
        const formattedKey = date.format('DD.MM.YYYY');
        const isoKey = date.format('YYYY-MM-DDTHH:mm:ss[Z]');

        const value = pointsMap[isoKey] || 0;

        data[formattedKey] = value;
        barsInfo[formattedKey] = {
          alias: formattedKey,
          color:`#${generateRandomHexColor(index)}`
        };
      });

      const idToTypeIdMap: Map<string, string> = new Map();
      articles.rows.forEach(row => {
        idToTypeIdMap.set(row.id.toString(), row.type_id);
      });

      const sumByTypeId: { [typeId: string]: number } = {};

      for (const [id, subKeys] of Object.entries(sales)) {
        const typeId = idToTypeIdMap.get(id);
        if (!typeId) {
          continue;
        }

        if (!sumByTypeId[typeId]) {
          sumByTypeId[typeId] = 0;
        }

        for (const entries of Object.values(subKeys)) {
          for (const entry of entries) {
            sumByTypeId[typeId] += entry.value;
          }
        }
      }

      const entries: [string, number][] = Object.entries(sumByTypeId);
      entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
      const sortedSums: number[] = entries.map(entry => entry[1]);

      return setDashboardChart({ sales: { data: [data], barsInfo }, salesByCategory: { values: sortedSums }, loading: false }) as ActionOut;
    }),
  );
};
