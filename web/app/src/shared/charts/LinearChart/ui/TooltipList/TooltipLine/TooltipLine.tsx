import { TOOLTIP_LINE_COLOR } from '@shared/charts/LinearChart/constants';
import { TooltipLineI } from '@shared/charts/LinearChart/models/TooltipLine';
import { Line } from '@visx/shape';
type Props = {
  tooltipLine: TooltipLineI;
};

export const TooltipLine = (props: Props) => {
  const { tooltipLine } = props;

  return (
    <g>
      <Line
        from={tooltipLine.from}
        to={tooltipLine.to}
        stroke={TOOLTIP_LINE_COLOR}
        strokeWidth={2}
        pointerEvents="none"
        strokeDasharray="5,2"
      />
      {tooltipLine.pointsCoordinates.map((coords) => {
        return (
          <circle
            key={coords.key}
            cx={coords.x}
            cy={coords.y}
            r={4}
            fill={tooltipLine.nearestPointYToCursor === coords.y ? TOOLTIP_LINE_COLOR : 'white'}
            stroke={coords.stroke}
            strokeWidth={2}
            pointerEvents="none"
          />
        );
      })}
    </g>
  );
};
