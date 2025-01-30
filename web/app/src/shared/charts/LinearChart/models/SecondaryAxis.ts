import { ChartData } from './ChartData';

export type SecondaryAxis = Pick<ChartData, 'name' | 'alias' | 'dimension'> & {
  key: string;
  // Используется для отображения названия второстепенной оси
  label: string;
  /**
   * Отображать с противоположной стороны.
   * */
  oppositeSide?: boolean;
};
