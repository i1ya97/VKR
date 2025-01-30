import { XY } from "./XY";

export type ToolipPoint = XY & {
  // Нужен для указания key реакта
  key: string;
  stroke: string;
};

