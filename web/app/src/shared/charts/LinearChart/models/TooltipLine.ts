
import { ToolipPoint } from "./TooltipPoint";
import { XY } from "./XY";

export type TooltipLineI = {
  from: XY;
  to: XY;
  pointsCoordinates: ToolipPoint[];
  nearestPointYToCursor: number;
};

