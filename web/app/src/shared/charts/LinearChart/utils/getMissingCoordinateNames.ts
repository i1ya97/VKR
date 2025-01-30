export const getMissingCoordinateNames = (dataNames: string[], linesOnCurrentPosition: string[]): string[] =>
  dataNames.filter((a1) => !linesOnCurrentPosition.includes(a1));