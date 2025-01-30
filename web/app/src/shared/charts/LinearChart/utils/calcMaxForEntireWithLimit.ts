import { max } from 'd3-array';
import { Data } from '../models/Data';
import { ChartType } from '../models/ChartType';
import { DomainsLimits } from '../models/DomainsLimits';

export function calcMaxForEntireWithLimit(
  keys: string[],
  data: Data[],
  chartType: ChartType,
  accumulate: boolean | undefined,
  domainsLimits: DomainsLimits,
) {
  if (chartType === ChartType.linear) {
    if (accumulate) {
      // максимальная сумма из всех точек на основной оси
      return calcMaxAccumulated(data);
    }

    // максимальное значение среди всех линий на основной оси
    return Math.max(
      max(keys, (lineName) => domainsLimits[lineName].max) || 1,
      max(keys, (lineName) => {
        return max(data, (points) => {
          return points[lineName] as number;
        });
      }) || 1,
    );
  }

  if (accumulate) {
    // максимальное значение суммированных столбцов среди всех значений основной оси
    return calcMaxAccumulated(data);
  }

  // самый большой столбец среди всех данных на основной оси
  return Math.max(
    max(keys, (lineName) => domainsLimits[lineName].max) || 1,
    max(data, (points) => {
      return Math.max(
        ...Object.entries(points)
          .filter(({ 0: lineName }) => !(lineName === 'key'))
          .map(({ 1: value }) => value as number),
      );
    }) || 1,
  );

  function calcMaxAccumulated(data: Data[]) {
    return Math.max(
      max(keys, (lineName) => domainsLimits[lineName].max) || 1,
      max(data, (points) => {
        return Object.entries(points)
          .filter(({ 0: lineName }) => !(lineName === 'key'))
          .reduce((sumOfData, { 1: value }) => (sumOfData += value as number), 0);
      }) || 1,
    );
  }
}
