import { Fragment, MouseEvent, TouchEvent, useMemo } from 'react';
import { Bar, Line } from '@visx/shape';
import { localPoint } from '@visx/event';
import { defaultStyles, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { Group } from '@visx/group';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { Typography } from '@mui/material';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import { Data } from '../../models/Data';
import { ChartType } from '../../models/ChartType';
import { ChartProps, MainAxisType } from '../../models/ChartProps';
import { GRID_COLOR, TOOLTIP_LINE_COLOR } from '../../constants';
import { getClosestPoint } from '../../utils/getClosestPoint';
import { findNearestData } from '../../utils/findNearestData';
import { formatDate } from '../../utils/formatDate';
import { ChartData } from '../../models/ChartData';
import { isValidNumber } from '../../utils/isValidNumber';

interface RangeInfo {
  key: string;
  range: (string | number)[] | null;
}

type Props = Pick<ChartProps, 'chartData' | 'mainAxisType' | 'switchAxises' | 'accumulate' | 'continueLineData'> & {
  marginLeft: number;
  marginTop: number;
  xMax: number;
  yMax: number;
  data: Data[];
  keys: string[];
  xScale: ScaleBand<string>;
  xScaleLinear: ScaleLinear<number, number, never>;
  yScaleLinear: (lineName?: string) => ScaleLinear<number, number, never>;
  chartType: ChartType;
};

const Tooltip = (props: Props & WithTooltipProvidedProps<Data>) => {
  const {
    marginLeft,
    marginTop,
    xMax,
    yMax,
    chartData,
    data,
    keys,
    xScale,
    xScaleLinear,
    yScaleLinear,
    chartType,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    mainAxisType = 'time',
    switchAxises,
    accumulate,
    continueLineData,
  } = props;

  const filteredKeys = useMemo(() => keys.filter((k) => tooltipData?.[k] !== undefined), [keys, tooltipData]);

  const rangedData = useMemo<Data[]>(() => {
    /* TODO
     * вынести в useChartData или попробовать вынести в prepareData
     * (обрезать дату только при ее подготовке и дальше по всему проекту уже работать с ней)
     * */
    if (!continueLineData) {
      const ranges: RangeInfo[] = findRangesForEachKey(keys, chartData);

      return cutTheData(data, ranges, mainAxisType);
    }

    return data;
  }, [data, keys, chartData, continueLineData, mainAxisType]);

  const handleTooltip = (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>, data: Data[]) => {
    if (!data?.length) return null;

    const { x, y } = localPoint(event) || { x: 0, y: 0 };

    if (chartType === ChartType.bars) {
      showTooltipForBar(xScale, { x, y }, data, chartType);
    } else {
      showTooltipForLinear(xScaleLinear, yScaleLinear, switchAxises, { x, y }, data);
    }
  };

  // Очень хотелось сделать чистой функцией и вынести из тела компонента, но достать тип для showTooltip не получилось
  function showTooltipForBar(
    xScale: ScaleBand<string>,
    xyPos: { x: number; y: number },
    data: Data[],
    chartType: ChartType,
  ): void {
    if (!getClosestPoint) return;

    const { x, y } = xyPos;
    const stepWidth = xScale.step();
    const stepIndex = Math.floor(x / stepWidth);

    const tooltipData = data[stepIndex];
    if (tooltipData) {
      const closestValue = getClosestPoint(tooltipData, y, keys, accumulate, yScaleLinear);
      showTooltip({
        tooltipData,
        tooltipLeft:
          chartType === ChartType.bars
            ? stepWidth * (stepIndex + xScale.padding()) + xScale.bandwidth() / 2
            : stepWidth * stepIndex,
        tooltipTop: closestValue,
      });
    }
  }

  function showTooltipForLinear(
    xScaleLinear: Props['xScaleLinear'],
    yScaleLinear: Props['yScaleLinear'],
    switchAxises: Props['switchAxises'],
    xyPos: { x: number; y: number },
    rangedData: Data[],
  ): void {
    if (!xScaleLinear || (switchAxises && !yScaleLinear) || !getClosestPoint) return;

    const { x, y } = xyPos;
    
    const scaledX = xScaleLinear.invert(switchAxises ? y : x);
    const nearestNextIndex = rangedData.findIndex((df) => Number(df.key) >= scaledX);

    const tooltipData = findNearestData(rangedData, nearestNextIndex, scaledX);

    if (tooltipData) {
      const closestValue = getClosestPoint(tooltipData, switchAxises ? x : y, filteredKeys, accumulate, yScaleLinear);
      showTooltip({
        tooltipData,
        tooltipLeft: switchAxises ? closestValue : xScaleLinear(Number(tooltipData.key)),
        tooltipTop: switchAxises ? xScaleLinear(Number(tooltipData.key)) : closestValue,
      });
    }
  }

  /**
   * TODO
   * Это очень сбивает с толку - нужен рефакторинг
   */
  let accumulatedData = { ...tooltipData };
  let closestKey: string | undefined;
  if (tooltipData && yScaleLinear) {
    filteredKeys.forEach((k, i) => {
      if (accumulate && tooltipData[filteredKeys[i]]) {
        let prevSum = 0;
        for (let prevI = 0; prevI < i; prevI++) {
          prevSum += tooltipData[filteredKeys[prevI]] as number;
        }
        accumulatedData[k] = (tooltipData[k] as number) + prevSum;
      }

      if (
        accumulatedData[k] !== 0 &&
        yScaleLinear(accumulate ? undefined : k)(accumulatedData[k] as number) ===
        (switchAxises ? tooltipLeft : tooltipTop)
      ) {
        closestKey = k;
      }
    });
  }

  return (
    <>
      <svg width={xMax} height={yMax} transform={`translate(${marginLeft}, ${marginTop})`}>
        <Bar
          x={0}
          y={0}
          width={xMax}
          height={yMax}
          fill="transparent"
          rx={0}
          onTouchStart={(event) => handleTooltip(event, rangedData)}
          onTouchMove={(event) => handleTooltip(event, rangedData)}
          onMouseMove={(event) => handleTooltip(event, rangedData)}
          onMouseLeave={() => hideTooltip()}
        />
        {tooltipData && yScaleLinear && (
          <Group>
            <Line
              from={{ x: switchAxises ? 0 : tooltipLeft, y: switchAxises ? tooltipTop : 0 }}
              to={{ x: switchAxises ? xMax : tooltipLeft, y: switchAxises ? tooltipTop : yMax }}
              stroke={TOOLTIP_LINE_COLOR}
              strokeWidth={2}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            {filteredKeys.map((k) => (
              <Fragment key={`tooltip-circle-${k}`}>
                <circle
                  cx={
                    switchAxises
                      ? (yScaleLinear(accumulate ? undefined : k)(accumulatedData[k] as number) ?? 0) + 1
                      : tooltipLeft
                  }
                  cy={
                    switchAxises
                      ? tooltipTop
                      : (yScaleLinear(accumulate ? undefined : k)(accumulatedData[k] as number) ?? 0) + 1
                  }
                  r={4}
                  fill="black"
                  fillOpacity={0.1}
                  stroke="black"
                  strokeOpacity={0.1}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <circle
                  cx={
                    switchAxises
                      ? yScaleLinear(accumulate ? undefined : k)(accumulatedData[k] as number) ?? 0
                      : tooltipLeft
                  }
                  cy={
                    switchAxises
                      ? tooltipTop
                      : yScaleLinear(accumulate ? undefined : k)(accumulatedData[k] as number) ?? 0
                  }
                  r={4}
                  fill={closestKey === k ? TOOLTIP_LINE_COLOR : GRID_COLOR}
                  stroke="white"
                  strokeWidth={2}
                  pointerEvents="none"
                />
              </Fragment>
            ))}
          </Group>
        )}
      </svg>
      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop + marginTop - 12}
          left={tooltipLeft + marginLeft - 12}
          style={{
            ...defaultStyles,
            background: '#F8F8F8',
            border: 'none',
            color: 'rgba(0,0,0,0.87)',
            margin: '12px',
            zIndex: '20',
            maxWidth: '50%',
          }}
        >
          <Typography sx={{ fontWeight: 'bold', color: 'rgba(0,0,0,0.87)' }}>
            {mainAxisType === 'numeric' ? tooltipData.key : formatDate(tooltipData.key as string, 'DD MMM YYYY')}
          </Typography>
          {filteredKeys.filter((k) => isValidNumber(tooltipData[k])).map((k) => {
            const cd = chartData.find((cd) => k === `${cd.name}${cd.additionalName ? `-${cd.additionalName}` : ''}`);

            return (
              <Typography
                key={`tooltip-p-${k}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <svg width={3} height={16}>
                  <line
                    x={0}
                    y1={0}
                    y2={16}
                    stroke={cd?.styleSettings?.stroke}
                    strokeWidth={3}
                    strokeDasharray={cd?.styleSettings?.strokeDasharray}
                  />
                </svg>
                <span>{`${cd?.alias ?? ''}: ${(tooltipData[k] as number)?.toFixed(2)} ${cd?.dimension ?? ''}`}</span>
              </Typography>
            );
          })}
        </TooltipWithBounds>
      )}
    </>
  );
};

export default withTooltip<Props, Data>(Tooltip);

function findRangesForEachKey(keys: string[], chartData: ChartData[]): RangeInfo[] {
  return keys.map((lineName, i) => {
    // chartData и keys имеют одинаковые размер и последовательность
    const graphDataForKey = chartData[i].data;

    const firstKey = graphDataForKey[0]?.key;
    const lastKey = graphDataForKey.at(-1)?.key;

    if (!firstKey || !lastKey) {
      return {
        key: lineName,
        range: null,
      };
    }

    return {
      key: lineName,
      range: [firstKey, lastKey],
    };
  });
}

function cutTheData(data: Data[], ranges: RangeInfo[], mainAxisType: MainAxisType): Data[] {
  return data.map((points) => {
    const newElement: Data = {
      key: points.key,
    };
    ranges.forEach((r) => {
      if (!r.range) return;

      if (mainAxisType === 'time') {
        if (
          (points.key as number) >= new Date(r.range[0]).getTime() &&
          (points.key as number) <= new Date(r.range[1]).getTime()
        ) {
          newElement[r.key] = points[r.key];
        }
      } else {
        if (points.key >= r.range[0] && points.key <= r.range[1]) {
          newElement[r.key] = points[r.key];
        }
      }
    });

    return newElement;
  });
}
