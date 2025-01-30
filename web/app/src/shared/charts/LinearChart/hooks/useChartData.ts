import { useMemo } from 'react';

import { LinePathsItem } from '../models/LinePathsItem';
import { ILinePath } from '../models/ILinePath';
import { Data } from '../models/Data';
import { SecondaryAxis } from '../models/SecondaryAxis';
import { ChartType } from '../models/ChartType';
import { ChartProps } from '../models/ChartProps';
import { CUSTOM_Y_AXIS_WIDTH, DEFAULT_MARGIN } from '../constants';
import { sortInAscendingOrder } from '../utils/sortInAscendingOrder';
import { CheckedLegend } from '../models/CheckedLegend';
import { UseChartDataOutput } from '../models/UseChartDataOutput';
import { ChartDataFiltered, ChartDataFiltered as ChartDataWithKey } from '../models/ChartDataFiltered';
import { createKeyToCheckedFabric } from '../utils/createKeyToCheckedFabric';
import { createSecondaryAxisFabric } from '../utils/createSecondaryAxisFabric';
import { filterByUnique } from '../utils/filterByUnic';
import { DomainsLimits } from '../models/DomainsLimits';
import { useGraphsStyles } from './useGraphsStyles';
import { prepareData } from '../utils/prepareData';
import { useDomain } from './useDomain';
import { useMargin } from './useMargin';
import { useScale } from './useScale';
import { generateOutOfRangeZones } from '../utils/generateOutOfRangeZones';

export const useChartData = (
  props: Omit<ChartProps, 'chartData'> & { chartData: ChartDataWithKey[] },
  checkedState: CheckedLegend[],
  selectedName: string | undefined,
  chartType: ChartType,
): UseChartDataOutput => {
  const {
    chartId,
    width,
    height,
    chartData,
    margin = DEFAULT_MARGIN,
    generateMissingPoints,
    mainAxisType = 'time',
    disableLegend,
    legendHeight = 60,
    customSecondaryAxis,
    startFromZeroCoordinates,
    continueLineData = false,
    accumulate,
    range,
    nice,
    reverseSecondaryAxis,
    reverseMainAxis,
    switchAxises,
    secondaryAxisForEachData,
    groupByProperty,
    uniqueLegendKey,
    legendCheckboxes,
    secondaryAxisForEachDataLabel,
    maxMarginsExternalDomId,
  } = props;

  const keyToCheckedFabric = useMemo(() => {
    return createKeyToCheckedFabric(uniqueLegendKey);
  }, [uniqueLegendKey]);

  const checkedParams = useMemo(() => {
    return keyToCheckedFabric(checkedState);
  }, [checkedState]);

  const filteredChartData = useMemo<ChartDataFiltered[]>(() => {
    return (
      chartData
        .filter((cd) => {
          if (uniqueLegendKey === 'key' && !accumulate) return true;

          const isChecked =
            legendCheckboxes && !!uniqueLegendKey ? checkedParams.get(String(cd[uniqueLegendKey])) : true;

          const isSelected = !!selectedName ? cd.name === selectedName : true;

          return isChecked && isSelected;
        })
        // см. Note1
        .sort(sortInAscendingOrder)
    );
  }, [chartData, selectedName, uniqueLegendKey, checkedParams]);

  // Имеется ввиду массив осей для Каждого графа
  const secondaryAxises = useMemo<SecondaryAxis[] | null>(() => {
    if (!customSecondaryAxis && !secondaryAxisForEachData) return null;

    const createSecondaryAxis = createSecondaryAxisFabric(secondaryAxisForEachDataLabel);

    if (groupByProperty) {
      return filteredChartData.filter(filterByUnique(groupByProperty)).map(createSecondaryAxis);
    }
    return filteredChartData.map(createSecondaryAxis);
  }, [filteredChartData, customSecondaryAxis, groupByProperty]);

  const keys = useMemo<string[]>(() => filteredChartData.map((cd) => cd.key), [filteredChartData]);
  const groupByKeys = useMemo<string[] | null>(
    () => (groupByProperty ? filteredChartData.filter(filterByUnique(groupByProperty)).map((cd) => cd.key) : null),
    [filteredChartData],
  );

  const domainsLimits = useMemo<DomainsLimits | null>(() => {
    const limitations = filteredChartData.reduce((limitations, cd) => {
      limitations[cd.key] = {
        min: cd.minDomain,
        max: cd.maxDomain,
      };
      return limitations;
    }, {} as DomainsLimits);

    if (Object.keys(limitations).length === 0) return null;

    return limitations;
  }, [filteredChartData]);

  const { graphsStyles } = useGraphsStyles({ filteredChartData });

  const dataToReverse = useMemo<{ [lineName: string]: boolean } | null>(() => {
    if (!filteredChartData.length || !keys.length) return null;

    return filteredChartData.reduce((result, cd, i) => {
      result[keys[i]] = cd.reverse ?? false;
      return result;
    }, {} as { [lineName: string]: boolean });
  }, [filteredChartData, keys]);

  const data = useMemo<Data[]>(
    () => prepareData(filteredChartData, generateMissingPoints, mainAxisType, chartType),
    [filteredChartData, mainAxisType, generateMissingPoints, chartType],
  );

  const { maxValuesForEachLine, minValueForEntire, maxValueForEntire, minValuesForEachLine } = useDomain({
    data,
    chartType,
    keys,
    accumulate,
    startFromZeroCoordinates,
    groupByProperty,
    chartData: filteredChartData,
    domainsLimits,
  });

  const {
    marginRightExternal,
    leftAxisesWidths,
    rightAxisesWidths,
    marginLeftInternal,
    marginRightInternal,
    marginLeftExternal,
  } = useMargin({
    keys: groupByKeys ? groupByKeys : keys,
    maxValuesForEachLine,
    minValuesForEachLine,
    margin,
    secondaryAxises,
    customSecondaryAxis,
    maxMarginsExternalDomId,
    chartId,
  });

  const xMax = width - marginLeftExternal - marginLeftInternal - marginRightExternal - marginRightInternal;

  const marginLeft = margin.left + (secondaryAxises?.length ? CUSTOM_Y_AXIS_WIDTH * (secondaryAxises.length - 1) : 0);
  const marginTop = margin.top;

  const yMax = height - (!disableLegend ? legendHeight : 0) - margin.top - margin.bottom;

  const { xScaleBand, yScaleLinear, xScaleLinear, xScaleLinearForWidth } = useScale({
    data,
    xMax,
    width,
    maxValueForEntire,
    minValueForEntire,
    maxValuesForEachLine,
    minValuesForEachLine,
    yMax,
    startFromZeroCoordinates,
    nice,
    reverseSecondaryAxis,
    reverseMainAxis,
    switchAxises,
    dataToReverse,
    mainAxisType,
  });

  const rangeZones = useMemo<[number, number][][]>(() => {
    // Пока что только для линейных графиков.
    if (
      !data.length ||
      !range ||
      range.values.length !== 2 ||
      !yScaleLinear ||
      !xScaleLinear ||
      chartType !== ChartType.linear ||
      !minValueForEntire ||
      !maxValueForEntire
    ) {
      return [];
    }

    return generateOutOfRangeZones(data, range, xScaleLinear, yScaleLinear, minValueForEntire, maxValueForEntire);
  }, [data, range, yScaleLinear, xScaleLinear, chartType, minValueForEntire, maxValueForEntire]);

  /**
   * TODO
   * Декомпозировать
   * */
  const linePaths = useMemo<ILinePath[]>(
    () =>
      keys.map((k, lineNameIndex) => {
        let range: (string | number)[] | null = null;
        const currentData = filteredChartData.find((cd) => k === cd.key);
        if (!continueLineData) {
          const originData = currentData?.data.sort((a, b) => (a.key < b.key ? -1 : 1));
          range =
            originData && originData.length > 1 ? [originData[0].key, originData[originData.length - 1].key] : null;
        }

        if (
          !yScaleLinear ||
          (chartType === ChartType.bars && !xScaleBand) ||
          (chartType === ChartType.linear && !xScaleLinear)
        ) {
          return {
            key: k,
            dotsType: currentData?.dotsType,
            isDefined: currentData?.isDefined,
            data: [],
          };
        }

        return {
          key: k,
          dotsType: currentData?.dotsType,
          isDefined: currentData?.isDefined,
          data: data
            .filter((d) => {
              if (!!range) {
                if (mainAxisType === 'time') {
                  return (
                    (d.key as number) >= new Date(range[0]).getTime() &&
                    (d.key as number) <= new Date(range[1]).getTime()
                  );
                }
                return d.key >= range[0] && d.key <= range[1];
              }
              return true;
            })
            .map((d) => {
              let accumulatedValue = d[k] as number;

              if (accumulate) {
                for (let i = 0; i < lineNameIndex; i++) {
                  accumulatedValue += d[keys[i]] as number;
                }
              }

              return {
                x:
                  chartType === ChartType.linear
                    ? switchAxises
                      ? yScaleLinear!(k)(d[k] as number)
                      : xScaleLinear!(Number(d.key))
                    : xScaleBand!(d.key as string),
                // prettier-ignore
                y: switchAxises
                  ? xScaleLinear!(Number(d.key))
                  : yScaleLinear(accumulate ? undefined : k)(accumulatedValue),
              } as LinePathsItem;
            }),
        };
      }),
    [
      xScaleBand,
      xScaleLinear,
      yScaleLinear,
      data,
      keys,
      xMax,
      yMax,
      continueLineData,
      accumulate,
      filteredChartData,
      switchAxises,
    ],
  );

  return {
    keys,
    data,
    secondaryAxises,
    xScaleBand,
    xScaleLinear,
    yScaleLinear,
    xScaleLinearForWidth,
    marginLeft,
    marginTop,
    xMax,
    yMax,
    linePaths,
    minValueForEntire,
    minValuesForEachLine,
    rangeZones,
    graphsStyles,
    filteredChartData,
    leftAxisesWidths,
    rightAxisesWidths,
    marginLeftExternal,
    marginRightExternal,
    marginLeftInternal,
    marginRightInternal,
  };
};
