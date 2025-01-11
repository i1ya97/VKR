import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { DonutItem } from '../../models/DonutItem';

export const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<DonutItem>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});
