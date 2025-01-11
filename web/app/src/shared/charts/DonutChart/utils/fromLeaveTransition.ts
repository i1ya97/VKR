import { PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { DonutItem } from '../../models/DonutItem';

export const fromLeaveTransition = ({ startAngle, endAngle }: PieArcDatum<DonutItem>) => ({
  startAngle: startAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
