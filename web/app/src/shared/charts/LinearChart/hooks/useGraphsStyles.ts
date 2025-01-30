import { useMemo } from 'react';
import { ChartDataFiltered } from '../models/ChartDataFiltered';
import { GraphsStyles } from '../models/GraphsStyles';

type Params = {
  filteredChartData: ChartDataFiltered[];
};

export const useGraphsStyles = (params: Params) => {
  const { filteredChartData } = params;

  const graphsStyles = useMemo(() => {
    if (!filteredChartData.length) return null;

    return filteredChartData.reduce((styles, chart, i) => {
      styles[chart.key] = {
        ...(chart.color ? { stroke: chart.color } : {}),
        strokeDasharray: chart.dasharray,
        ...chart.styleSettings,
      };

      return styles;
    }, {} as GraphsStyles);
  }, [filteredChartData]);

  return {
    graphsStyles,
  };
};
