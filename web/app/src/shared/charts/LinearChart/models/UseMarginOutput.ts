import { AxisesWidth } from './AxisesWidth';

export type UseMarginOutput = {
  marginLeftExternal: number;
  marginLeftInternal: number;
  marginRightExternal: number;
  marginRightInternal: number;
  leftAxisesWidths: AxisesWidth | null;
  rightAxisesWidths: AxisesWidth | null;
};
