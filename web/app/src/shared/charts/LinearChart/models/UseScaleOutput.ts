import { ScaleBand, ScaleLinear } from 'd3-scale';

export type UseScaleOutput = {
  xScaleBand: ScaleBand<string> | null;
  xScaleLinear: ScaleLinear<number, number, never> | null;
  yScaleLinear: ((lineName?: string) => ScaleLinear<number, number, never>) | null;
  xScaleLinearForWidth?: ScaleLinear<number, number, never> | null;
};
