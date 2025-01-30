import { useMemo } from 'react';
import { ChartType } from '../models/ChartType';
import { DefaultSharedData } from '../models/DefaultSharedData';
import { UseCoreOutput } from '../models/UseCoreOutput';
import { useCheckedLegend } from './useCheckedLegend';
import { getKey } from '../utils/getKey';
import { useSelectGraph } from './useSelectGraph';
import { useChartData } from './useChartData';

export const useCore = (params: DefaultSharedData, chartType: ChartType): UseCoreOutput => {
  const {
    chartData,
    legendCheckboxes = true,
    nameSelection,
    onLegendChange,
    uniqueLegendKey = 'key',
    disableLegend,
  } = params;

  const chartDataWithKey = useMemo(() => {
    return chartData.map((cd) => {
      return { ...cd, key: getKey(cd) };
    });
  }, [chartData]);

  const { handleChangeLegend, legendState, names } = useCheckedLegend({
    chartDataWithKey,
    legendCheckboxes,
    onLegendChange,
    uniqueLegendKey,
    disableLegend,
  });

  const {
    handleNameSelectorItemClick,
    handleCloseNameSelector,
    handleNameSelectorButtonClick,
    selectedName,
    menuAnchorEl,
  } = useSelectGraph({ names, nameSelection });

  const {
    keys,
    data,
    linePaths,
    secondaryAxises,
    xScaleBand,
    xScaleLinear,
    yScaleLinear,
    xScaleLinearForWidth,
    marginLeft,
    marginTop,
    xMax,
    yMax,
    rangeZones,
    graphsStyles,
    filteredChartData,
    minValueForEntire,
    minValuesForEachLine,
    leftAxisesWidths,
    rightAxisesWidths,
    marginLeftExternal,
    marginLeftInternal,
    marginRightExternal,
    marginRightInternal,
  } = useChartData({ ...params, chartData: chartDataWithKey }, legendState, selectedName, chartType);

  return {
    handleChangeLegend,
    legendState,
    names,
    handleNameSelectorItemClick,
    handleCloseNameSelector,
    handleNameSelectorButtonClick,
    selectedName,
    menuAnchorEl,
    keys,
    data,
    linePaths,
    secondaryAxises,
    xScaleBand,
    xScaleLinear,
    yScaleLinear,
    xScaleLinearForWidth,
    marginLeft,
    marginTop,
    xMax,
    yMax,
    rangeZones,
    graphsStyles,
    filteredChartData,
    minValueForEntire,
    minValuesForEachLine,
    leftAxisesWidths,
    rightAxisesWidths,
    marginLeftExternal,
    marginLeftInternal,
    marginRightExternal,
    marginRightInternal,
  };
};
