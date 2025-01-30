export const findClosestNumber = (array: number[], goal: number) => {
  if (array.length === 0) {
    return goal; // or return a default value if appropriate
  }
  return array.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev), array[0]);
};
