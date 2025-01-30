import { ChartData } from '../models/ChartData';
import { MainAxisType } from '../models/ChartProps';
import { ChartType } from '../models/ChartType';
import { Data } from '../models/Data';
import dayjs from 'dayjs';
import { coordinatesWithAllIntersects } from './coordinatesWithAllIntersects';
import { getMissingCoordinateNames } from './getMissingCoordinateNames';

/**
 * Преобразования типа
 * { name: string; data: { key: string | number ; value: number }[] }[]
 * =>
 * { key: (изначальный ключ); [имя линии/данных]: value }[]
 * */
export const prepareData = (
  chartData: ChartData[],
  generateMissingPoints: boolean = false,
  mainAxisType: MainAxisType = 'time',
  chartType: ChartType,
) => {
  let result: Data[] = [];
  const dataNames = chartData.map((cd) => `${cd.name}${cd.additionalName ? `-${cd.additionalName}` : ''}`);
  chartData
    .flatMap((cd) =>
      cd.data.map((d) => ({
        key: mainAxisType === 'time' && chartType !== ChartType.bars ? dayjs(d.key).valueOf() : d.key,
        value: d.value,
        name: `${cd.name}${cd.additionalName ? `-${cd.additionalName}` : ''}`,
      })),
    )
    .sort((a, b) => (a.key < b.key ? -1 : 1))
    .forEach((fd) => {
      const exist = result.find((d) => d.key === fd.key);
      if (exist) {
        exist[fd.name] = fd.value;
      } else {
        const newElement: Data = {
          key: fd.key,
          [fd.name]: fd.value,
        };
        result.push(newElement);
      }
    });

  if (!generateMissingPoints) {
    result = result.filter((d) =>
      coordinatesWithAllIntersects(
        dataNames,
        // Название всех линий, проходящих через данную координату по X.
        Object.keys(d).filter((k) => k !== 'key'),
      ),
    );
  } else {
    result = result.map((res, index) => {
      const missingNames = getMissingCoordinateNames(
        dataNames,
        // Название всех линий, проходящих через данную координату по X.
        Object.keys(res).filter((k) => k !== 'key'),
      );
      missingNames.forEach((mn) => {
        const prevRes = result.findLast((r, i) => i < index && r[mn] !== undefined);
        const nextRes = result.find((r, i) => i > index && r[mn] !== undefined);
        const prevVal = Number(prevRes?.[mn] ?? 0);
        const nextVal = Number(nextRes?.[mn] ?? prevVal);
        if (prevRes && nextRes) {
          if (mainAxisType === 'time') {
            const x1Diff = dayjs(res.key).valueOf() - dayjs(prevRes.key).valueOf();
            const x2Diff = dayjs(nextRes.key).valueOf() - dayjs(prevRes.key).valueOf();
            const y2Diff = nextVal - prevVal;
            const y1Diff = (x1Diff / x2Diff) * y2Diff;
            res[mn] = y1Diff + prevVal;
          } else {
            const x1Diff = Number(res.key) - Number(prevRes.key);
            const x2Diff = Number(nextRes.key) - Number(prevRes.key);
            const y2Diff = nextVal - prevVal;
            const y1Diff = (x1Diff / x2Diff) * y2Diff;
            res[mn] = y1Diff + prevVal;
          }
        } else {
          res[mn] = prevVal;
        }
      });
      return res;
    });
  }
  return result;
};
