import { ChartProps } from "./ChartProps";

export type DefaultSharedData = SharedData & DefaultProps;


export interface SharedData
  extends Readonly<ChartProps> {
  readonly type:
    | 'linear'
    | 'linearWithAreaBrush'
    | 'linearWithScroll';
}

export type DefaultProps = Required<
  Pick<
    ChartProps,
    | 'margin'
    | 'mainAxisTicksNumber'
    | 'legendHeight'
    | 'legendPosition'
    | 'linearType'
    | 'styleSettings'
    | 'uniqueLegendKey'
    | 'tooltipType'
  >
>;
