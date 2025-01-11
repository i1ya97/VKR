import { useMemo } from 'react';
import Box from '@mui/material/Box';
import { ParentSize } from '@visx/responsive';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleBand, scaleLinear } from '@visx/scale';

import Legend from './ui/Legend/Legend';
import BarGroup from './ui/BarGroup/BarGroup';
import MaskStripe from './ui/MaskStripe/MaskStripe';
import VerticalLineComponent from './ui/VerticalLineComponent/VerticalLineComponent';

import { root } from './styles';
import { getGroupKey } from './utils/getGroupKey';
import { HistogramProps } from '../models/HistogramProps';
import { axisMinPadding } from './constants/axisMinPadding';
import { initYAxisWidth } from './constants/initYAxisWidth';
import { paddingTopAxis } from './constants/paddingTopAxis';
import { paddingBottomAxis } from './constants/paddingBottomAxis';
import { recalculateDataPercentage } from './utils/recalculateDataPercentage';

export const Histogram = (props: HistogramProps) => {
  const {
    data,
    barsInfo,
    style,
    hideGridRows,
    paddingBar = 0.2,
    paddingBarGroup = 0.2,
    hideGridColumns = true,
    histogramType = 'cardinal',
    gridRowsDasharray = '4',
    gridColumnsDasharray = '4',
    numTicksX = 5,
    numTicksY = 5,
    orientation = 'vertical',
    axisLeftOptions,
    axisBottomOptions,
    verticalLines,
    disableLegend,
  } = props;

  if (!data) return null;

  const keys = useMemo(
    () => (data?.length ? Object.keys(data[0]).filter((d) => d !== 'groupKey') : []) as string[],
    [data],
  );

  const processedData = useMemo(
    () => (histogramType === 'relative' ? recalculateDataPercentage(data, keys) : data),
    [data],
  );

  const groupKeyScale = useMemo(
    () =>
      scaleBand<string>({
        domain: processedData.map(getGroupKey),
        padding: processedData.length > 1 ? paddingBarGroup : 0,
      }),
    [processedData],
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [
          Math.min(0, ...processedData.map((d) => Math.min(...keys.map((key) => Number(d[key] ?? ''))))),
          Math.max(...processedData.map((d) => Math.max(...keys.map((key) => Number(d[key] ?? ''))))) * 1.2,
        ],
      }),
    [keys],
  );

  const yAxisWidth = useMemo(
    () => (axisLeftOptions?.hideLabel ? axisMinPadding : initYAxisWidth),
    [axisLeftOptions?.hideLabel],
  );

  const textColor = useMemo(() => style?.textColor ?? 'rgba(255, 255, 255, 0.64)', [style?.textColor]);
  const gridColor = useMemo(() => style?.gridColor ?? 'rgba(255, 255, 255, 0.16)', [style?.gridColor]);

  return (
    <Box sx={root}>
      <ParentSize>
        {({ width, height }) => {
          const xMax = axisBottomOptions?.hideLabel ? width : width - yAxisWidth;
          const yMax = axisBottomOptions?.hideLabel ? height - axisMinPadding : height - paddingBottomAxis;

          groupKeyScale.rangeRound(orientation == 'vertical' ? [0, xMax] : [yMax, paddingTopAxis]);
          yScale?.range(orientation == 'vertical' ? [yMax, paddingTopAxis] : [0, xMax]);

          return (
            <Box sx={{ display: 'grid' }}>
              <svg width={width} height={height}>
                <AxisLeft
                  left={yAxisWidth}
                  scale={orientation == 'vertical' ? yScale : groupKeyScale}
                  stroke={textColor}
                  tickStroke={textColor}
                  numTicks={numTicksY}
                  tickLabelProps={() => ({
                    fill: textColor,
                    fontSize: 14,
                    textAnchor: 'end',
                    transform: 'translate(-4, 4)',
                  })}
                  {...axisLeftOptions}
                />
                <AxisBottom
                  top={yMax}
                  left={yAxisWidth}
                  scale={orientation == 'vertical' ? groupKeyScale : yScale}
                  stroke={textColor}
                  tickStroke={textColor}
                  numTicks={numTicksX}
                  tickLabelProps={() => ({
                    fill: textColor,
                    fontSize: 14,
                    textAnchor: 'middle',
                  })}
                  {...axisBottomOptions}
                />
                {!hideGridRows && (
                  <GridRows
                    left={yAxisWidth}
                    width={xMax}
                    scale={orientation === 'vertical' ? yScale : groupKeyScale}
                    stroke={gridColor}
                    strokeDasharray={gridRowsDasharray}
                    numTicks={numTicksY}
                  />
                )}
                {!hideGridColumns && (
                  <GridColumns
                    top={paddingTopAxis}
                    left={yAxisWidth}
                    height={yMax}
                    scale={orientation === 'vertical' ? groupKeyScale : yScale}
                    stroke={gridColor}
                    strokeDasharray={gridColumnsDasharray}
                    numTicks={numTicksX}
                  />
                )}
                <BarGroup
                  data={processedData}
                  keys={keys}
                  barsInfo={barsInfo}
                  groupKeyScale={groupKeyScale}
                  yScale={yScale}
                  orientation={orientation}
                  histogramType={histogramType}
                  yMax={yMax}
                  xMax={xMax}
                  yAxisWidth={yAxisWidth}
                  paddingBar={paddingBar}
                  textColor={textColor}
                />
                {orientation === 'vertical' &&
                  verticalLines?.map((line) => (
                    <VerticalLineComponent
                      key={`additional-${line.y}`}
                      line={line}
                      yScale={yScale}
                      yAxisWidth={yAxisWidth}
                      xMax={xMax}
                      textColor={textColor}
                    />
                  ))}
                <MaskStripe />
              </svg>
            </Box>
          );
        }}
      </ParentSize>
      {!disableLegend && (
        <Legend barsInfo={barsInfo} keys={keys} textColor={textColor} background={style?.backgroundLegend} />
      )}
    </Box>
  );
};
