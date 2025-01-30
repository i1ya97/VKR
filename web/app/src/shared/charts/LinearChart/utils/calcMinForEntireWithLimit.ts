import { min } from 'd3-array';
import { Data } from '../models/Data';
import { DomainsLimits } from '../models/DomainsLimits';

export function calcMinForEntireWithLimit(keys: string[], data: Data[], domainsLimits: DomainsLimits) {
  return (
    min(keys, (lineName) => {
      if (domainsLimits[lineName].min != null) {
        return domainsLimits[lineName].min;
      }
      return min(data, (points) => {
        return points[lineName] as number;
      });
    }) || 1
  );
}
