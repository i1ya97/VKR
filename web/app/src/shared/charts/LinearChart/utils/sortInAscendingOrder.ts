import { ChartData } from "../models/ChartData";

export function sortInAscendingOrder(a: ChartData, b: ChartData) {
  const more = a.data.at(-1)?.value ?? 0;
  const less = b.data.at(-1)?.value ?? 0;
  if (more > less) {
    return 1;
  } else if (less > more) {
    return -1;
  }
  return 0;
}
