import { Line } from '@visx/shape';
import { Group } from '@visx/group';
import { ScaleLinear } from '@visx/vendor/d3-scale';

import { VerticalLine } from '../../../models/VerticalLine';
import { indentToCenterText } from '../../constants/indentToCenterText';

interface Props {
  line: VerticalLine;
  yScale: ScaleLinear<number, number, never>;
  yAxisWidth: number;
  xMax: number;
  textColor: string;
}

const VerticalLineComponent = (props: Props) => {
  const { line, yScale, yAxisWidth, xMax, textColor } = props;

  return (
    <Group key={`additional-${line.y}`}>
      <Line
        x1={yAxisWidth}
        y1={yScale(line.y)}
        x2={xMax + yAxisWidth}
        y2={yScale(line.y)}
        stroke={line.color}
        strokeDasharray={line.strokeDasharray ?? '4'}
      />
      {!line.hideLabel && (
        <text
          x={xMax + yAxisWidth}
          y={yScale(line.y) - indentToCenterText}
          fill={textColor}
          fontSize={14}
          textAnchor={'end'}
        >
          {line.y.toFixed(0)}
        </text>
      )}
    </Group>
  );
};

export default VerticalLineComponent;
