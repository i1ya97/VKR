import { AxisBottom, AxisLeft, AxisRight, AxisTop, TickFormatter, TickLabelProps } from '@visx/axis';
import { Group } from '@visx/group';
import { GridAndAxisesProps } from '../../GridAndAxises';
import CustomSecondaryAxis from '../CustomSecondaryAxis';
import { NumberValue, ScaleLinear } from 'd3-scale';
import { useMemo } from 'react';
import { StyleSettings } from '@shared/charts/LinearChart/models/ChartData';
import { SEC_AXIS_WIDTH } from '@shared/charts/LinearChart/constants';

type SecondaryAxisProps = Pick<
  GridAndAxisesProps,
  | 'switchSecondaryAxisPosition'
  | 'switchAxises'
  | 'marginTop'
  | 'marginLeftExternal'
  | 'marginLeftInternal'
  | 'secondaryAxisTicksNumber'
  | 'secondaryAxisTickFormat'
  | 'hideAxisLine'
  | 'secondaryAxisLabel'
  | 'secondaryAxises'
  | 'customSecondaryAxis'
  | 'yMax'
  | 'xMax'
  | 'yScaleLinear'
  | 'separateTicksDigits'
  | 'graphsStyles'
  | 'leftAxisesWidths'
  | 'rightAxisesWidths'
> & {
  styleSettings: StyleSettings;
  groupeBy: boolean;
  yScaleLinear: (lineName?: string) => ScaleLinear<number, number, never>;
};

const SecondaryAxisManager = (props: SecondaryAxisProps) => {
  const {
    customSecondaryAxis,
    switchSecondaryAxisPosition,
    switchAxises,
    graphsStyles,
    marginTop,
    marginLeftInternal,
    marginLeftExternal,
    secondaryAxisTicksNumber,
    secondaryAxisTickFormat,
    hideAxisLine,
    secondaryAxisLabel,
    secondaryAxises,
    yMax,
    xMax,
    yScaleLinear,
    styleSettings,
    separateTicksDigits,
    leftAxisesWidths,
    rightAxisesWidths,
    groupeBy,
  } = props;
  const defaultAxisColor = styleSettings.defaultAxisColor;
  const ticksColor = defaultAxisColor ?? styleSettings.ticksColor;
  const tickLabelColor = defaultAxisColor ?? styleSettings.tickLabelColor;
  const labelColor = defaultAxisColor ?? styleSettings.labelColor;

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
      dx: switchSecondaryAxisPosition ? '0.25em' : '-0.25em',
      dy: '0.25em',
      fontSize: 10,
      textAnchor: switchSecondaryAxisPosition ? ('start' as const) : ('end' as const),
      fill: tickLabelColor,
    }),
    [tickLabelColor, switchSecondaryAxisPosition],
  );

  const tickFormat = useMemo<TickFormatter<string | NumberValue> | undefined>(() => {
    if (!secondaryAxisTickFormat && separateTicksDigits) return undefined;

    return (value) => {
      return secondaryAxisTickFormat ? secondaryAxisTickFormat(value) : value.toString();
    };
  }, [separateTicksDigits, secondaryAxisTickFormat]);

  const primarySecondaryAxises = secondaryAxises?.filter((sa) => !sa.oppositeSide);
  const oppositeSecondaryAxises = secondaryAxises?.filter((sa) => sa.oppositeSide);

  return (
    <>
      {switchAxises && switchSecondaryAxisPosition && !secondaryAxises && (
        <AxisTop
          left={marginLeftInternal}
          top={marginTop}
          scale={yScaleLinear()}
          label={secondaryAxisLabel}
          labelProps={{
            fill: labelColor,
          }}
          tickFormat={tickFormat}
          numTicks={secondaryAxisTicksNumber}
          stroke={ticksColor}
          tickStroke={ticksColor}
          hideAxisLine={hideAxisLine}
          tickLabelProps={horizontalAxisTicksConfig}
        />
      )}

      {switchAxises && switchSecondaryAxisPosition && secondaryAxises && (
        <Group>
          {secondaryAxises?.map((axis, i) => (
            <AxisTop
              key={axis.key}
              left={marginLeftInternal}
              top={marginTop - i * (SEC_AXIS_WIDTH + 5)}
              scale={yScaleLinear(axis.key)}
              label={axis.label}
              labelProps={{
                dx: yMax - marginLeftInternal,
                dy: '0.5em',
                fontSize: 12,
                textAnchor: 'end' as const,
                fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
              }}
              tickFormat={tickFormat}
              numTicks={secondaryAxisTicksNumber}
              stroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
              tickStroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
              hideAxisLine={hideAxisLine}
              tickLabelProps={() => ({
                textAnchor: 'middle' as const,
                fontSize: 10,
                fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
              })}
            />
          ))}
        </Group>
      )}

      {!switchAxises && switchSecondaryAxisPosition && !secondaryAxises && (
        <AxisRight
          left={marginLeftInternal + xMax}
          top={marginTop}
          scale={yScaleLinear()}
          label={secondaryAxisLabel}
          labelProps={{
            fill: labelColor,
          }}
          tickFormat={tickFormat}
          numTicks={secondaryAxisTicksNumber}
          stroke={ticksColor}
          tickStroke={ticksColor}
          hideAxisLine={hideAxisLine}
          tickLabelProps={verticalAxisTicksConfig}
        />
      )}

      {!switchAxises &&
        ((switchSecondaryAxisPosition && primarySecondaryAxises) ||
          (!switchSecondaryAxisPosition && oppositeSecondaryAxises)) && (
          <Group>
            {(switchSecondaryAxisPosition ? primarySecondaryAxises : oppositeSecondaryAxises)?.map((axis, i, self) => (
              <AxisRight
                key={axis.key}
                left={
                  marginLeftExternal +
                  marginLeftInternal +
                  xMax +
                  (self[i - 1]
                    ? (!switchSecondaryAxisPosition ? rightAxisesWidths : leftAxisesWidths)?.[self[i - 1].key]?.width ??
                      0
                    : 0)
                }
                top={marginTop}
                scale={yScaleLinear(axis.key)}
                label={axis.label}
                labelProps={{
                  dy: '0.5em',
                  dx: `${
                    (!switchSecondaryAxisPosition ? rightAxisesWidths : leftAxisesWidths)?.[axis.key]?.tickWidth ?? 0
                  }px`,
                  fontSize: 12,
                  fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
                }}
                labelOffset={0}
                tickFormat={tickFormat}
                numTicks={secondaryAxisTicksNumber}
                stroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
                tickStroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
                hideAxisLine={hideAxisLine}
                tickLabelProps={() => ({
                  dx: '0.25em',
                  dy: '0.25em',
                  fontSize: 10,
                  textAnchor: 'start' as const,
                  fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
                })}
              />
            ))}
          </Group>
        )}

      {switchAxises && !switchSecondaryAxisPosition && !secondaryAxises && (
        <AxisBottom
          left={marginLeftInternal}
          top={yMax + marginTop}
          scale={yScaleLinear()}
          label={secondaryAxisLabel}
          labelProps={{
            fill: labelColor,
          }}
          tickFormat={tickFormat}
          numTicks={secondaryAxisTicksNumber}
          stroke={ticksColor}
          tickStroke={ticksColor}
          hideAxisLine={hideAxisLine}
          tickLabelProps={horizontalAxisTicksConfig}
        />
      )}

      {switchAxises && !switchSecondaryAxisPosition && secondaryAxises && (
        <Group>
          {secondaryAxises?.map((axis, i) => (
            <AxisBottom
              key={axis.key}
              left={marginLeftInternal}
              top={yMax + marginTop + i * SEC_AXIS_WIDTH}
              scale={yScaleLinear(axis.key)}
              label={axis.label}
              labelProps={{
                dx: yMax - marginLeftInternal,
                dy: '0.5em',
                fontSize: 12,
                textAnchor: 'end' as const,
                fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
              }}
              tickFormat={tickFormat}
              numTicks={secondaryAxisTicksNumber}
              stroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
              tickStroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
              hideAxisLine={hideAxisLine}
              tickLabelProps={() => ({
                textAnchor: 'middle' as const,
                fontSize: 10,
                fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
              })}
            />
          ))}
        </Group>
      )}

      {!switchAxises && !switchSecondaryAxisPosition && !secondaryAxises && (
        <AxisLeft
          left={marginLeftExternal + marginLeftInternal}
          top={marginTop}
          scale={yScaleLinear()}
          label={secondaryAxisLabel}
          labelProps={{
            fill: labelColor,
          }}
          tickFormat={tickFormat}
          numTicks={secondaryAxisTicksNumber}
          stroke={ticksColor}
          tickStroke={ticksColor}
          hideAxisLine={hideAxisLine}
          tickLabelProps={verticalAxisTicksConfig}
        />
      )}

      {!switchAxises &&
        ((!switchSecondaryAxisPosition && primarySecondaryAxises) ||
          (switchSecondaryAxisPosition && oppositeSecondaryAxises)) && (
          <>
            {customSecondaryAxis && (
              <CustomSecondaryAxis
                secondaryAxises={!switchSecondaryAxisPosition ? primarySecondaryAxises! : oppositeSecondaryAxises!}
                marginLeft={marginLeftInternal + marginLeftExternal}
                marginTop={marginTop}
                yMax={yMax}
                mergedStyleSettings={styleSettings}
                yScaleLinear={yScaleLinear}
                secondaryAxisTickFormat={tickFormat}
                secondaryAxisTicksNumber={secondaryAxisTicksNumber}
              />
            )}
            {!customSecondaryAxis && groupeBy && (
              <Group>
                {(!switchSecondaryAxisPosition ? primarySecondaryAxises : oppositeSecondaryAxises)?.map((axis) => {
                  return (
                    <AxisLeft
                      key={axis.key}
                      left={
                        marginLeftExternal +
                        ((!switchSecondaryAxisPosition ? leftAxisesWidths : rightAxisesWidths)?.[axis.key]?.width ?? 0)
                      }
                      top={marginTop}
                      scale={yScaleLinear(axis.key)}
                      label={axis.dimension}
                      labelOffset={0}
                      labelProps={{
                        dy: '0.5em',
                        dx: `${-(
                          (!switchSecondaryAxisPosition ? leftAxisesWidths : rightAxisesWidths)?.[axis.key]
                            ?.tickWidth ?? 0
                        )}px`,
                        fontSize: 12,
                        fill: ticksColor,
                      }}
                      tickFormat={tickFormat}
                      numTicks={secondaryAxisTicksNumber}
                      stroke={ticksColor}
                      tickStroke={ticksColor}
                      hideAxisLine={hideAxisLine}
                      tickLabelProps={verticalAxisTicksConfig}
                    />
                  );
                })}
              </Group>
            )}
            {!customSecondaryAxis && !groupeBy && (
              <Group>
                {(!switchSecondaryAxisPosition ? primarySecondaryAxises : oppositeSecondaryAxises)?.map((axis) => {
                  return (
                    <AxisLeft
                      key={axis.key}
                      left={
                        marginLeftExternal +
                        ((!switchSecondaryAxisPosition ? leftAxisesWidths : rightAxisesWidths)?.[axis.key]?.width ?? 0)
                      }
                      top={marginTop}
                      scale={yScaleLinear(axis.key)}
                      label={axis.label}
                      labelProps={{
                        dy: '0.5em',
                        dx: `${-(
                          (!switchSecondaryAxisPosition ? leftAxisesWidths : rightAxisesWidths)?.[axis.key]
                            ?.tickWidth ?? 0
                        )}px`,
                        fontSize: 12,
                        fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
                      }}
                      labelOffset={0}
                      tickFormat={tickFormat}
                      numTicks={secondaryAxisTicksNumber}
                      stroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
                      tickStroke={defaultAxisColor ?? graphsStyles[axis.key].stroke}
                      hideAxisLine={hideAxisLine}
                      tickLabelProps={() => ({
                        dx: '-0.25em',
                        dy: '0.25em',
                        fontSize: 10,
                        textAnchor: 'end' as const,
                        fill: defaultAxisColor ?? graphsStyles[axis.key].stroke,
                      })}
                    />
                  );
                })}
              </Group>
            )}
          </>
        )}
    </>
  );
};

export default SecondaryAxisManager;
