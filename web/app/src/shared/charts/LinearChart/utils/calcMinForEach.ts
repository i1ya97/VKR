import { ChartData } from "../models/ChartData";
import { Data } from "../models/Data";
import { Domains } from "../models/Domains";

export function calcMinForEach(
  keys: string[],
  data: Data[],
  concatenateDate: ChartData[] | null,
  startFromZero: number[],
) {
  if (concatenateDate) {
    return keys.reduce((minValues, lineName, i) => {
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
