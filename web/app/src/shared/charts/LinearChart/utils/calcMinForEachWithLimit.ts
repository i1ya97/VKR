import { ChartData } from "../models/ChartData";
import { Data } from "../models/Data";
import { Domains } from "../models/Domains";
import { DomainsLimits } from "../models/DomainsLimits";

export function calcMinForEachWithLimit(
  keys: string[],
  data: Data[],
  concatenateDate: ChartData[] | null,
  startFromZero: number[],
  domainsLimits: DomainsLimits,
) {
  if (concatenateDate) {
    return keys.reduce((minValues, lineName, i) => {
      if (domainsLimits[lineName].min != null) {
        minValues[lineName] = domainsLimits[lineName].min as number;
        return minValues;
      }

      minValues[lineName] = Math.min(
        ...concatenateDate[i].data.map((points) => {
          return points.value;
        }),
        // Могут приходить отрицательные значения
        ...startFromZero,
      );
      return minValues;
    }, {} as Domains);
  }

  return keys.reduce((minValues, lineName) => {
    if (domainsLimits[lineName].min != null) {
      minValues[lineName] = domainsLimits[lineName].min as number;
      return minValues;
    }
    minValues[lineName] = Math.min(
      ...data.map((points) => {
        return points[lineName] as number;
      }),
      // Могут приходить отрицательные значения
      ...startFromZero,
    );
    return minValues;
  }, {} as Domains);
}
