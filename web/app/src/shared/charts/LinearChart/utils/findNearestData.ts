import { Data } from '../models/Data';

export function findNearestData(rangedData: Data[], nearestNextIndex: number, scaledX: number): Data {
  const dataLeftOfTheCursor = rangedData[nearestNextIndex - 1];
  const dataRightOfTheCursor = rangedData[nearestNextIndex];

  const distanceToTheLeft = scaledX - ((dataLeftOfTheCursor?.key as number | undefined) ?? 0);
  const distanceToTheRight = ((dataRightOfTheCursor?.key as number | undefined) ?? 0) - scaledX;

  return distanceToTheLeft < distanceToTheRight ? dataLeftOfTheCursor : dataRightOfTheCursor;
}
