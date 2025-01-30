import { CheckedLegend } from "./CheckedLegend";
import { HandleChangeLegend } from "./HandleChangeLegend";

export type UseCheckedLegendOutput = {
  legendState: CheckedLegend[];
  handleChangeLegend: HandleChangeLegend;
  names: string[];
};

