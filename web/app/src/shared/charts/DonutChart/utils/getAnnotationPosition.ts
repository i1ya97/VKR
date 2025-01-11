import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { DonutItem } from '../../models/DonutItem';

export const getAnnotationPosition = ({
  arc,
  path,
  xMultiplier = 0.2,
  yMultiplier = 0.2,
}: {
  arc: PieArcDatum<DonutItem>;
  path: any;
  xMultiplier: number;
  yMultiplier: number;
}): {
  labelX: number;
  labelY: number;
  surfaceX: number;
  surfaceY: number;
} => {
  const middleAngle = Math.PI / 2 - (arc.startAngle + (arc.endAngle - arc.startAngle) / 2);

  const outerRadius: number = path.outerRadius()(arc);

  const normalX = Math.cos(middleAngle);
  const normalY = Math.sin(-middleAngle);

  const labelX = normalX * outerRadius * xMultiplier * (middleAngle < Math.PI ? 1 : -1);
  const labelY = normalY * yMultiplier * outerRadius;

  const surfaceX = normalX * outerRadius;
  const surfaceY = normalY * outerRadius;

  return {
    labelX,
    labelY,
    surfaceX,
    surfaceY,
  };
};
