import { AxisBottom, AxisLeft, AxisRight, AxisTop, TickFormatter, TickLabelProps } from '@visx/axis';
import { GridAndAxisesProps } from '../../GridAndAxises';
import { NumberValue } from 'd3-scale';
import { useMemo } from 'react';
import { StyleSettings } from '@shared/charts/LinearChart/models/ChartData';

type MainAxisProps = Pick<
  GridAndAxisesProps,
  | 'switchMainAxisPosition'
  | 'switchAxises'
  | 'marginTop'
  | 'xScale'
  | 'marginLeftExternal'
  | 'marginLeftInternal'
  | 'mainAxisTicksNumber'
  | 'mainAxisTickFormat'
  | 'hideAxisLine'
  | 'mainAxisLabel'
  | 'mainAxisType'
  | 'yMax'
  | 'xMax'
  | 'separateTicksDigits'
> & {
  styleSettings: StyleSettings;
};

const MainAxis = (props: MainAxisProps) => {
  const {
    switchMainAxisPosition,
    switchAxises,
    marginTop,
    xScale,
    marginLeftInternal,
    marginLeftExternal,
    mainAxisTicksNumber,
    mainAxisTickFormat,
    styleSettings,
    hideAxisLine,
    mainAxisLabel,
    mainAxisType,
    yMax,
    xMax,
    separateTicksDigits,
  } = props;

  const ticksColor = styleSettings.defaultAxisColor ?? styleSettings.ticksColor;
  const tickLabelColor = styleSettings.defaultAxisColor ?? styleSettings.tickLabelColor;
  const labelColor = styleSettings.defaultAxisColor ?? styleSettings.labelColor;

  const horizontalAxisTicksConfig = useMemo<TickLabelProps<string | NumberValue>>(
    () => ({
      textAnchor: 'middle' as const,
      fontSize: 10,
      fill: tickLabelColor,
    }),
    [tickLabelColor],
  );

  const verticalAxisTicksConfig = useMemo<TickLabelProps<string | NumberValue>>(
    () => ({
      dx: switchMainAxisPosition ? '0.25em' : '-0.25em',
      dy: '0.25em',
      fontSize: 10,
      textAnchor: switchMainAxisPosition ? ('start' as const) : ('end' as const),
      fill: tickLabelColor,
    }),
    [tickLabelColor, switchMainAxisPosition],
  );

  const tickFormat = useMemo<TickFormatter<string | NumberValue> | undefined>(() => {
    if ((!mainAxisTickFormat && separateTicksDigits) || (!mainAxisTickFormat && mainAxisType !== 'numeric')) {
      return undefined;
    }

    return (value) => {
      return mainAxisTickFormat ? mainAxisTickFormat(value) : value.toString();
    };
  }, [separateTicksDigits, mainAxisType, mainAxisTickFormat]);

  if (!switchAxises && switchMainAxisPosition) {
    return (
      <AxisTop
        left={marginLeftInternal + marginLeftExternal}
        top={marginTop}
        scale={xScale}
        label={mainAxisLabel}
        labelProps={{
          fill: labelColor,
        }}
        tickFormat={tickFormat}
        numTicks={mainAxisTicksNumber}
        stroke={ticksColor}
        tickStroke={ticksColor}
        hideAxisLine={hideAxisLine}
        tickLabelProps={horizontalAxisTicksConfig}
      />
    );
  }

  if (switchAxises && switchMainAxisPosition) {
    return (
      <AxisRight
        left={marginLeftInternal + xMax}
        top={marginTop}
        scale={xScale}
        label={mainAxisLabel}
        labelProps={{
          fill: labelColor,
        }}
        tickFormat={tickFormat}
        numTicks={mainAxisTicksNumber}
        stroke={ticksColor}
        tickStroke={ticksColor}
        hideAxisLine={hideAxisLine}
        tickLabelProps={verticalAxisTicksConfig}
      />
    );
  }

  if (!switchAxises && !switchMainAxisPosition) {
    return (
      <AxisBottom
        left={marginLeftInternal + marginLeftExternal}
        top={yMax + marginTop}
        scale={xScale}
        label={mainAxisLabel}
        labelProps={{
          fill: labelColor,
        }}
        tickFormat={tickFormat}
        numTicks={mainAxisTicksNumber}
        stroke={ticksColor}
        tickStroke={ticksColor}
        hideAxisLine={hideAxisLine}
        tickLabelProps={horizontalAxisTicksConfig}
      />
    );
  }

  if (switchAxises && !switchMainAxisPosition) {
    return (
      <AxisLeft
        left={marginLeftInternal}
        top={marginTop}
        scale={xScale}
        label={mainAxisLabel}
        labelProps={{
          fill: labelColor,
        }}
        tickFormat={tickFormat}
        numTicks={mainAxisTicksNumber}
        stroke={ticksColor}
        tickStroke={ticksColor}
        hideAxisLine={hideAxisLine}
        tickLabelProps={verticalAxisTicksConfig}
      />
    );
  }

  return <></>;
};

export default MainAxis;
