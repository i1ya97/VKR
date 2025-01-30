import { useState, useEffect, useMemo } from 'react';
import { ChartProps } from '../models/ChartProps';
import { CheckedLegend } from '../models/CheckedLegend';
import { HandleChangeLegend } from '../models/HandleChangeLegend';
import { ChartDataFiltered as ChartDataWithKey } from '../models/ChartDataFiltered';
import { UseCheckedLegendOutput } from '../models/UseCheckedLegendOutpur';
import { createUniqLegendsFabric } from '../utils/createUniqLedendsFabric';
import { sortInAscendingOrder } from '../utils/sortInAscendingOrder';
import { getUniqPrimitives } from '../utils/getUniqPrimitives';

export const useCheckedLegend = (
  params: Pick<ChartProps, 'legendCheckboxes' | 'onLegendChange' | 'uniqueLegendKey' | 'disableLegend'> & {
    chartDataWithKey: ChartDataWithKey[];
  },
): UseCheckedLegendOutput => {
  const { chartDataWithKey, legendCheckboxes, onLegendChange, uniqueLegendKey, disableLegend } = params;

  const [legendState, setLegendState] = useState<CheckedLegend[]>([]);

  const legendStateFabric = useMemo(() => {
    return createUniqLegendsFabric(uniqueLegendKey);
  }, [uniqueLegendKey]);

  useEffect(() => {
    setLegendState(legendStateFabric(chartDataWithKey));
  }, [chartDataWithKey, disableLegend]);

  const handleChangeLegend: HandleChangeLegend = (parameter) => {
    const newCheckedState = legendState.map((item) => {
      if (item[uniqueLegendKey] === parameter) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      }

      return item;
    });

    setLegendState(newCheckedState);
    onLegendChange?.(newCheckedState.map((item) => item.isChecked));
  };

  const names = useMemo<string[]>(() => {
    const filteredCD = chartDataWithKey
      .filter((_, index) => (legendCheckboxes ? legendState[index] : true))
      // см. Note1
      .sort(sortInAscendingOrder);

    return getUniqPrimitives(filteredCD, 'name');
  }, [chartDataWithKey, legendState, legendCheckboxes]);

  return {
    legendState,
    handleChangeLegend,
    names,
  };
};
