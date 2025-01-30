import { useMemo } from 'react';
import { ChartProps } from '../models/ChartProps';
import { ChartType } from '../models/ChartType';
import { Data } from '../models/Data';
import { Domains } from '../models/Domains';
import { DomainsLimits } from '../models/DomainsLimits';
import { UseDomainsOutput } from '../models/UseDomainsOutput';
import { concatSimilarData } from '../utils/concatSimilarData';
import { calcMaxForEachWithLimit } from '../utils/calcMaxForEachWithLimit';
import { calcMaxForEach } from '../utils/calcMaxForEach';
import { calcMinForEachWithLimit } from '../utils/calcMinForEachWithLimit';
import { calcMinForEach } from '../utils/calcMinForEach';
import { calcMaxForEntireWithLimit } from '../utils/calcMaxForEntireWithLimit';
import { calcMaxForEntire } from '../utils/calcMaxForEntire';
import { calcMinForEntireWithLimit } from '../utils/calcMinForEntireWithLimit';
import { calcMinForEntire } from '../utils/calcMinForEntire';

type UseDomainProps = Pick<ChartProps, 'accumulate' | 'startFromZeroCoordinates' | 'groupByProperty' | 'chartData'> & {
  data: Data[];
  keys: string[];
  chartType: ChartType;
  domainsLimits: DomainsLimits | null;
};

export const useDomain = (props: UseDomainProps): UseDomainsOutput => {
  const { keys, data, startFromZeroCoordinates, chartType, accumulate, groupByProperty, chartData, domainsLimits } =
    props;

  const concatenateDate = useMemo(() => {
    if (!data.length || !keys.length || !groupByProperty) return null;

    return concatSimilarData(chartData, groupByProperty);
  }, [data, keys, groupByProperty]);

  /**
   * Максимальное доменное значение по каждому массиву данных
   * */
  const maxValuesForEachLine = useMemo<Domains | null>(() => {
    if (!data.length || !keys.length || accumulate) return null;

    if (domainsLimits) {
      return calcMaxForEachWithLimit(keys, data, concatenateDate, domainsLimits);
    }

    return calcMaxForEach(keys, data, concatenateDate);
  }, [data, keys, accumulate, chartType, concatenateDate]);

  /**
   * Минимальное доменное значение по каждому массиву данных
   * */
  const minValuesForEachLine = useMemo<Domains | null>(() => {
    // Данные нужны для отображения аккумулированного областного графика
    if (!data.length || !keys.length) return null;

    const startFromZero = startFromZeroCoordinates || chartType !== ChartType.linear ? [0] : [];

    if (domainsLimits) {
      return calcMinForEachWithLimit(keys, data, concatenateDate, startFromZero, domainsLimits);
    }

    return calcMinForEach(keys, data, concatenateDate, startFromZero);
  }, [data, keys, accumulate, chartType, startFromZeroCoordinates, concatenateDate]);

  /**
   * Максимальное доменное значение из всех массивов данных
   * */
  const maxValueForEntire = useMemo<number | null>(() => {
    if (!data.length || !keys.length) return null;
    /* todo
     * Тут можно провести небольшую оптимизацию по необходимости расчета, тк maxValueForEntire используется почти, но не всегда.
     * */

    if (domainsLimits) {
      return calcMaxForEntireWithLimit(keys, data, chartType, accumulate, domainsLimits);
    }

    return calcMaxForEntire(keys, data, chartType, accumulate);
  }, [data, keys, accumulate, chartType]);

  /**
   * Минимальное доменное значение из всех массивов данных
   * */
  const minValueForEntire = useMemo<number | null>(() => {
    if (!data.length || !keys.length) return null;

    if (domainsLimits) {
      return calcMinForEntireWithLimit(keys, data, domainsLimits);
    }

    return calcMinForEntire(keys, data);
  }, [data, keys, chartType, startFromZeroCoordinates]);

  /**
   * Максимальное доменное значение из всех массивов данных, при отсутствии значения приравнивается к 1
   * */
  return {
    maxValueForEntire,
    minValueForEntire,
    maxValuesForEachLine,
    minValuesForEachLine,
  };
};
