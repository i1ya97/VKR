import { ReactNode, useMemo } from 'react';
import { GridColumns, GridRows } from '@visx/grid';
import { Bar } from '@visx/shape';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import SecondaryAxisManager from './components/SecondaryAxisManager';
import MainAxis from './components/MainAxis';
import { ChartProps } from '../../models/ChartProps';
import { SecondaryAxis } from '../../models/SecondaryAxis';
import { GraphsStyles } from '../../models/GraphsStyles';
import { AxisesWidth } from '../../models/AxisesWidth';
import { defaultStyleSetting } from '../../constants';

export type GridAndAxisesProps = ChartProps & {
  secondaryAxises: SecondaryAxis[] | null;
  xMax: number;
  yMax: number;
  xScale: ScaleBand<string> | ScaleLinear<number, number, never>;
  yScaleLinear: ((lineName?: string) => ScaleLinear<number, number, never>) | null;
  marginLeftInternal: number;
  marginLeftExternal: number;
  marginTop: number;
  keys: string[];
  children: ReactNode;
  graphsStyles: GraphsStyles;
  leftAxisesWidths: AxisesWidth | null;
  rightAxisesWidths: AxisesWidth | null;
  groupeBy?: boolean;
};

const GridAndAxises = (props: GridAndAxisesProps) => {
  const {
    mainAxisTicksNumber,
    secondaryAxisTicksNumber,
    xMax,
    yMax,
    xScale,
    yScaleLinear,
    marginLeftExternal,
    marginLeftInternal,
    marginTop,
    children,
    mainAxisGridEnabled = false,
    secondaryAxisGridEnabled = true,
    styleSettings,
    switchAxises,
    separateTicksDigits = true,
    showBorder,
    switchMainAxisPosition,
    switchSecondaryAxisPosition,
    groupeBy = false,
  } = props;

  const mergedStyleSettings = useMemo(() => {
    return {
      ...defaultStyleSetting,
      ...styleSettings,
    };
  }, [styleSettings]);

  if (!yScaleLinear) return <></>;

  return (
    <>
      <linearGradient id="linear-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor={mergedStyleSettings.gradientFrom} />
        <stop offset="70%" stopColor={mergedStyleSettings.gradientTo} />
      </linearGradient>
      <Bar
        x={marginLeftInternal + marginLeftExternal}
        y={marginTop}
        width={xMax}
        height={yMax}
        fill={mergedStyleSettings.backgroundColor}
        rx={0}
      />
      {secondaryAxisGridEnabled && (
        <GridRows
          top={marginTop}
          left={marginLeftInternal + marginLeftExternal}
          scale={switchAxises ? xScale : yScaleLinear()}
          width={xMax}
          height={yMax}
          numTicks={secondaryAxisTicksNumber}
        >
          {(data) =>
            data.lines
              .filter((l) => l.from.y !== yMax && l.to.y !== 0)
              .map((l) => (
                <line
                  key={`gridRow-${l.index}`}
                  x1={l.from.x}
                  y1={l.from.y}
                  x2={l.to.x}
                  y2={l.to.y}
                  className={'visx-line'}
                  shapeRendering={'crispEdges'}
                  fill={'transparent'}
                  stroke={mergedStyleSettings.gridColor}
                  strokeDasharray={mergedStyleSettings.gridDasharray}
                  strokeWidth={1}
                />
              ))
          }
        </GridRows>
      )}
      {mainAxisGridEnabled && (
        <GridColumns
          top={marginTop}
          left={marginLeftInternal + marginLeftExternal}
          scale={switchAxises ? yScaleLinear() : xScale}
          width={xMax}
          height={yMax}
          numTicks={mainAxisTicksNumber}
        >
          {(data) =>
            data.lines
              .filter((l) => l.from.x !== 0 && l.to.x !== xMax)
              .map((l) => (
                <line
                  key={`gridColumn-${l.index}`}
                  x1={l.from.x}
                  y1={l.from.y}
                  x2={l.to.x}
                  y2={l.to.y}
                  className={'visx-line'}
                  shapeRendering={'crispEdges'}
                  fill={'transparent'}
                  stroke={mergedStyleSettings.gridColor}
                  strokeDasharray={mergedStyleSettings.gridDasharray}
                  strokeWidth={1}
                />
              ))
          }
        </GridColumns>
      )}
      <MainAxis {...props} separateTicksDigits={separateTicksDigits} styleSettings={mergedStyleSettings} />
      {children}
      <SecondaryAxisManager
        {...props}
        groupeBy={groupeBy}
        separateTicksDigits={separateTicksDigits}
        styleSettings={mergedStyleSettings}
        yScaleLinear={yScaleLinear}
      />
      {showBorder && (
        <>
          <line
            x1={marginLeftInternal}
            y1={
              (switchMainAxisPosition && !switchAxises) || (switchSecondaryAxisPosition && switchAxises)
                ? yMax + marginTop + 0.5
                : marginTop + 0.5
            }
            x2={xMax + marginLeftInternal}
            y2={
              (switchMainAxisPosition && !switchAxises) || (switchSecondaryAxisPosition && switchAxises)
                ? yMax + marginTop + 0.5
                : marginTop + 0.5
            }
            className={'visx-line'}
            shapeRendering={'crispEdges'}
            fill={'transparent'}
            stroke={mergedStyleSettings.gridColor}
            strokeWidth={1}
          />
          <line
            x1={
              (switchSecondaryAxisPosition && !switchAxises) || (switchMainAxisPosition && switchAxises)
                ? marginLeftInternal
                : xMax + marginLeftInternal
            }
            y1={marginTop + 0.5}
            x2={
              (switchSecondaryAxisPosition && !switchAxises) || (switchMainAxisPosition && switchAxises)
                ? marginLeftInternal
                : xMax + marginLeftInternal
            }
            y2={yMax + marginTop + 0.5}
            className={'visx-line'}
            shapeRendering={'crispEdges'}
            fill={'transparent'}
            stroke={mergedStyleSettings.gridColor}
            strokeWidth={1}
          />
        </>
      )}
    </>
  );
};

export default GridAndAxises;
