import { max } from 'd3-array';
import { Data } from '../models/Data';
import { ChartData } from '../models/ChartData';
import { DomainsLimits } from '../models/DomainsLimits';
import { Domains } from '../models/Domains';

export function calcMaxForEachWithLimit(
  keys: string[],
  data: Data[],
  concatenateDate: ChartData[] | null,
  domainsLimits: DomainsLimits,
) {
  if (concatenateDate) {
    return keys.reduce((maxValues, lineName, i) => {
      if (domainsLimits[lineName].max != null) {
        maxValues[lineName] = domainsLimits[lineName].max as number;
        return maxValues;
      }

      maxValues[lineName] = max(concatenateDate[i].data, (points) => points.value) || 1;
      return maxValues;
    }, {} as Domains);
  }

  return keys.reduce((maxValues, lineName) => {
    if (domainsLimits[lineName].max != null) {
      maxValues[lineName] = domainsLimits[lineName].max as number;
      return maxValues;
    }

    maxValues[lineName] = max(data, (points) => points[lineName] as number) || 1;
    return maxValues;
  }, {} as Domains);
}
