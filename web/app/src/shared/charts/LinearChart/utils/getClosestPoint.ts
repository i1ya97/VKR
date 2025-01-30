import { GetClosestPoint } from "../models/GetClosestPoint";
import { findClosestNumber } from "./findClosestNumber";


export const getClosestPoint: GetClosestPoint = (d, y, keys, accumulate, yScaleLinear) => {
  let values = keys.map((lineName) => d![lineName] as number);
  if (accumulate) {
    values.reduce((totalSum, lineValue, lineIndex) => {
      const sum = ((totalSum as number) += lineValue as number);
      values[lineIndex] = sum;
      return sum;
    }, 0);
  }

  if (values.length) {
    return findClosestNumber(
      values
        .map((lineValue, lineIndex) => yScaleLinear(accumulate ? undefined : keys[lineIndex])(lineValue))
        .filter((v) => v),
      y,
    );
  }

  return 0;
};
