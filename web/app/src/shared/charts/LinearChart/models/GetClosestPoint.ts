import { ChartProps } from './ChartProps';
import { Data } from './Data';
import { UseScaleOutput } from './UseScaleOutput';

export type GetClosestPoint = (
  d: Data,
  y: number,
  keys: string[],
  accumulate: ChartProps['accumulate'],
  yScaleLinear: NonNullable<UseScaleOutput['yScaleLinear']>,
) => number;
