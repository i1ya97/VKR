import { ChartData } from './ChartData';

export type CheckedLegend = Omit<ChartData, 'data'> & {
  key: string;
  isChecked: boolean;
};
