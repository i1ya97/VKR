import { Group } from '@visx/group';
import { Typography } from '@mui/material';
import { AxisLeft, TickFormatter } from '@visx/axis';
import { NumberValue, ScaleLinear } from 'd3-scale';
import { ChartProps } from '@shared/charts/LinearChart/models/ChartProps';
import { SecondaryAxis } from '@shared/charts/LinearChart/models/SecondaryAxis';
import { StyleSettings } from '@shared/charts/LinearChart/models/ChartData';
import { CUSTOM_AXIS_WIDTH, CUSTOM_Y_AXIS_WIDTH, tickLabelSize, tickLength, wordLength } from '@shared/charts/LinearChart/constants';

type ICustomSecondaryAxisProps = Pick<ChartProps, 'secondaryAxisTicksNumber'> & {
  secondaryAxises: SecondaryAxis[];
  marginLeft: number;
  marginTop: number;
  yMax: number;
  mergedStyleSettings: StyleSettings;
  yScaleLinear: (lineName?: string) => ScaleLinear<number, number, never>;
  secondaryAxisTickFormat: TickFormatter<string | NumberValue> | undefined;
};

const CustomSecondaryAxis = (props: ICustomSecondaryAxisProps) => {
  const {
    secondaryAxises,
    marginLeft,
    marginTop,
    yMax,
    mergedStyleSettings,
    secondaryAxisTickFormat,
    yScaleLinear,
    secondaryAxisTicksNumber,
  } = props;

  const ticksColor = mergedStyleSettings.defaultAxisColor ?? mergedStyleSettings.ticksColor;

  return (
    <>
      {secondaryAxises.map((cya, i) => {
        const offset = (i + 1) * CUSTOM_Y_AXIS_WIDTH;

        return (
          <Group key={`customYAxis-${i}`} transform={`translate(${marginLeft}, ${marginTop})`}>
            <rect x={-offset} y={0} height={yMax} width={CUSTOM_AXIS_WIDTH} fill={'url(#linear-gradient)'} rx={4} />
            <foreignObject x={-offset} y={0} width={CUSTOM_AXIS_WIDTH - tickLabelSize} height={yMax}>
              <Typography
                sx={{
                  width: `${yMax}px`,
                  height: `${CUSTOM_AXIS_WIDTH - tickLabelSize}px`,
                  fontSize: '12px',
                  fontWeight: '600',
                  lineHeight: `${CUSTOM_AXIS_WIDTH - tickLabelSize}px`,
                  transformOrigin: '0 0',
                  transform: `rotate(-90deg) translate(-${yMax - 20}px, 0px)`,
                }}
              >
                {cya.alias}
                {cya.dimension && (
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: '400',
                    }}
                  >
                    {`, ${cya.dimension}`}
                  </Typography>
                )}
              </Typography>
            </foreignObject>
            <AxisLeft
              left={0}
              top={0}
              scale={yScaleLinear(cya.key)}
              tickFormat={secondaryAxisTickFormat}
              numTicks={secondaryAxisTicksNumber}
              stroke={ticksColor}
              tickStroke={ticksColor}
              tickLabelProps={() => ({
                dx: '-0.25em',
                dy: '0.25em',
                fontSize: 10,
                textAnchor: 'end' as const,
                fill: ticksColor,
              })}
            >
              {(props) => {
                const ticks = props.ticks;
                const getBoundaryOffset = (index: number): number => {
                  if (index === 0) {
                    return wordLength;
                  }
                  if (index === ticks.length - 1) {
                    return -((ticks[index].formattedValue?.length || 1) * wordLength);
                  }
                  return 0;
                };

                return (
                  <Group>
                    {ticks.map((tick, i) => {
                      return (
                        <g key={`tick-${cya.name}-${i}`}>
                          <line
                            strokeWidth="1"
                            x1={0}
                            x2={tickLength}
                            y={0}
                            stroke={mergedStyleSettings.gradientTicksColor}
                            transform={`translate(-${offset - CUSTOM_AXIS_WIDTH + tickLength} ${tick.to.y})`}
                          />
                          <text
                            transform={`translate(-${offset - CUSTOM_AXIS_WIDTH + tickLength} ${
                              tick.to.y - getBoundaryOffset(i)
                            }) rotate(-90)`}
                            fontSize={tickLabelSize}
                            textAnchor="middle"
                            fill={mergedStyleSettings.gradientTicksColor}
                          >
                            {tick.formattedValue}
                          </text>
                        </g>
                      );
                    })}
                  </Group>
                );
              }}
            </AxisLeft>
          </Group>
        );
      })}
    </>
  );
};

export default CustomSecondaryAxis;
