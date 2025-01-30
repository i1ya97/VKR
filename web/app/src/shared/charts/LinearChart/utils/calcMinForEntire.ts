import { min } from 'd3-array';
import { Data } from '../models/Data';

export function calcMinForEntire(keys: string[], data: Data[]) {
  return (
    min(keys, (lineName) => {
      return min(data, (points) => {
        return points[lineName] as number;
      });
    }) || 1
  );
}
