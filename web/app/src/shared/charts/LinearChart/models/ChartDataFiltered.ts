import { ChartData } from "./ChartData";

export type ChartDataFiltered = ChartData & {
  // Компаозитный ключ. Основной критерий уникальности
  key: string;
};
