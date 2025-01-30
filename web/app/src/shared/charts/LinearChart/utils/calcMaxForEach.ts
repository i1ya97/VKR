import { max } from 'd3-array';
import { Data } from '../models/Data';
import { ChartData } from '../models/ChartData';
import { Domains } from '../models/Domains';

export function calcMaxForEach(keys: string[], data: Data[], concatenateDate: ChartData[] | null) {
  if (concatenateDate) {
    return keys.reduce((maxValues, lineName, i) => {
      maxValues[lineName] = max(concatenateDate[i].data, (points) => points.value) || 1;
      return maxValues;
    }, {} as Domains);
  }

  return keys.reduce((maxValues, lineName) => {
    maxValues[lineName] = max(data, (points) => points[lineName] as number) || 1;
    return maxValues;
  }, {} as Domains);
}
