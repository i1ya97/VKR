import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { EMPTY, catchError, finalize, forkJoin, from, map } from 'rxjs';

import { ChartData } from '@shared/charts/LinearChart/models/ChartData';
import { ApiMethods, request } from '@shared/api';
import { createNormalizedInterval } from '../utils';
import { findMinMaxKeys, TimeSeries } from '../utils/findMinMaxKeys';
import { Curve, Product } from '@widgets/Forecasting/models';


export function useChartData(
  products: Product[],
  curves: Curve[],
  dateStart: dayjs.Dayjs | null,
  dateEnd: dayjs.Dayjs | null
) {
  const [chartData, setChartData] = useState<ChartData[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!products?.length || !curves?.length) {
      setChartData([]);
      return;
    }

    setLoading(true);

    const sub = forkJoin({
      plan: from(request<TimeSeries>(ApiMethods.POST, `/api`, `/TimeSeries/getPredictions`, {
        productIds: products.map((p) => p.id),
        curves: curves.map((p) => p.key),
        startDate: dateStart ? dateStart.add(dayjs().utcOffset(), 'minute').toISOString() : undefined,
        endDate: dateEnd ? dateEnd.add(dayjs().utcOffset(), 'minute').toISOString() : undefined,
      })).pipe(
        map((res) => res?.data ?? {}),
        catchError(() => EMPTY),
      ),
      fact: from(request<TimeSeries>(ApiMethods.POST, `/api`, `/TimeSeries`, {
        productIds: products.map((p) => p.id),
        curves: curves.map((p) => p.key),
        startDate: dateStart ? dateStart.add(dayjs().utcOffset(), 'minute').toISOString() : undefined,
        endDate: dateEnd ? dateEnd.add(dayjs().utcOffset(), 'minute').toISOString() : undefined,
      })).pipe(
        map((res) => res?.data ?? {}),
        catchError(() => EMPTY),
      ),
    }).subscribe(({ fact, plan }) => {
      const result: ChartData[] = [];

      const { minDate, maxDate } = findMinMaxKeys([fact, plan]);

      if (products.length == 1) {
        const line: ChartData[] = curves.flatMap((curve) => {

          return [{
            name: curve.key,
            additionalName: curve.key,
            alias: curve.name,
            dotsType: 'display',
            isDefined: true,
            styleSettings: {
              stroke: curve.color,
              strokeWidth: 2,
            },
            data: createNormalizedInterval(
              minDate,
              maxDate,
              fact[products[0].id]?.[curve.key] ?? [],
              'day',
            ),
          } as ChartData, {
            name: curve.key + 'plan',
            additionalName: curve.key,
            alias: curve.name + ' (прогноз)',
            dotsType: 'display',
            isDefined: true,
            styleSettings: {
              stroke: curve.color,
              strokeWidth: 2,
              strokeDasharray: '4 4',
            },
            data: createNormalizedInterval(
              minDate,
              maxDate,
              plan[products[0].id]?.[curve.key] ?? [],
              'day',
            ),
          } as ChartData];
        })
          .filter((c) => c.data.length > 0);

        result.push(...line);

      } else if (curves.length == 1) {
        const line: ChartData[] = products
          .flatMap((product) => {

            return [{
              name: product.id,
              alias: product.name,
              dotsType: 'display',
              isDefined: true,
              styleSettings: {
                stroke: product.color,
                strokeWidth: 2,
              },
              data: createNormalizedInterval(
                minDate,
                maxDate,
                fact[product.id]?.[curves[0].key] ?? [],
                'day',
              ),
            } as ChartData, {
              name: product.id + 'plan',
              alias: product.name + ' (прогноз)',
              dotsType: 'display',
              isDefined: true,
              styleSettings: {
                stroke: product.color,
                strokeWidth: 2,
                strokeDasharray: '4 4',
              },
              data: createNormalizedInterval(
                minDate,
                maxDate,
                plan[product.id]?.[curves[0].key] ?? [],
                'day',
              ),
            } as ChartData];
          })
          .filter((c) => c.data.length > 0);

        result.push(...line);
      }
      setLoading(false);
      setChartData(result);
    });

    return () => sub.unsubscribe();
  }, [curves, products, dateStart, dateEnd]);

  return { chartData, loading };
}
