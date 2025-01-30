import dayjs from "dayjs";

export interface TimeSeries {
  [key: string]: {
    [subKey: string]: { key: string; value: number }[];
  };
}

export function findMinMaxKeys(dataArray: TimeSeries[]): { minDate: dayjs.Dayjs; maxDate: dayjs.Dayjs } {
  let minKey: string | null = null;
  let maxKey: string | null = null;

  for (const data of dataArray) {
    for (const mainKey in data) {
      for (const subKey in data[mainKey]) {
        for (const entry of data[mainKey][subKey]) {
          if (minKey === null || entry.key < minKey) {
            minKey = entry.key;
          }
          if (maxKey === null || entry.key > maxKey) {
            maxKey = entry.key;
          }
        }
      }
    }
  }

  return { minDate: dayjs.utc(minKey ?? ""), maxDate: dayjs.utc(maxKey ?? "") };
}
