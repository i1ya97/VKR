import { Circle } from '@visx/shape';
import { ChartProps } from '../../models/ChartProps';
import { LinePathsItem } from '../../models/LinePathsItem';
import { ILinePath } from '../../models/ILinePath';
import { GraphStyle } from '../../models/ChartData';

type Props = Pick<ChartProps, 'styleSettings'> & {
  point: LinePathsItem;
  linePath: ILinePath;
  graphStyle: GraphStyle;
};

export const Marker = (props: Props) => {
  const { styleSettings, point, graphStyle } = props;

  if (graphStyle.markerCustomProps || styleSettings?.markerCustomProps) {
    return (
      <polygon
        key={point.x + point.y}
        transform={
          `translate(${point.x - (graphStyle.strokeWidth ?? 1) / 2}, ${point.y - (graphStyle.strokeWidth ?? 1) / 2})` +
          ` scale(${graphStyle.strokeWidth})`
        }
        fill={graphStyle.stroke}
        {...(graphStyle.markerCustomProps || styleSettings!.markerCustomProps)}
      />
    );
  }

  return (
    <Circle key={point.x + point.y} r={graphStyle.strokeWidth} cx={point.x} cy={point.y} fill={graphStyle.stroke} />
  );
};
