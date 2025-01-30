import { BarInfo } from "@shared/charts";
import { HistogramData } from "@shared/charts/models/HistogramData";

export interface DashboardChart {
    salesByCategory?: {
        values: number[],
    };
    sales?: {
        data: HistogramData[],
        barsInfo: BarInfo
    };
    loading: boolean;
  }
  