import { Group } from '@visx/group';
import { Fragment } from 'react';
import { Line, Polygon } from '@visx/shape';
import { ScaleLinear } from 'd3-scale';
import { useTheme } from '@mui/material';
import { ChartProps } from '../../models/ChartProps';
import { ILinePath } from '../../models/ILinePath';
import { RangeZones } from '../../models/RangeZones';
import { chartTextDark, chartTextLight } from '../../constants';

type RangeProps = Pick<ChartProps, 'range'> & {
  linePaths: ILinePath[];
  yScaleLinear: (lineName?: string) => ScaleLinear<number, number, never>;
  marginLeft: number;
  xMax: number;
  rangeZones: RangeZones;
  margin: { top: number; right: number; bottom: number; left: number };
};

const Range = (props: RangeProps) => {
  const { range, margin, linePaths, rangeZones, yScaleLinear, marginLeft, xMax } = props;

  const theme = useTheme();

  if (range?.values.length !== 2 || linePaths.length > 1) return null;

  return (
    <>
      <Group>
        {range.values.map((value, index) =>
          value > yScaleLinear().domain()[0] && value < yScaleLinear().domain()[1] ? (
            <Fragment key={`referenceValue-${range.name}-${index}`}>
              <Line
                x1={marginLeft}
                y1={yScaleLinear()(value)}
                x2={xMax + marginLeft}
                y2={yScaleLinear()(value)}
                stroke={range.color}
              />
              <text
                x={xMax}
                y={yScaleLinear()(value) - 5}
                fill={theme.palette.mode === 'dark' ? chartTextDark : chartTextLight}
                fontSize={10}
                textAnchor={'middle'}
              >
                {value.toFixed(2)}
              </text>
            </Fragment>
          ) : null,
        )}
      </Group>
      {!!rangeZones.length && (
        <Group top={margin.top} left={marginLeft}>
          {rangeZones.map((rangeZone) => {
            return <Polygon key={rangeZone[0][0]} points={rangeZone} fill={`#FF6F5B80`} />;
          })}
        </Group>
      )}
    </>
  );
};

export default Range;
