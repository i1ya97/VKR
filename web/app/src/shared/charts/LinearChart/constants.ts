import { StyleSettings } from './models/ChartData';
import { LinePathsItem } from './models/LinePathsItem';

export const DEFAULT_MARGIN = { top: 0, right: 0, bottom: 30, left: 50 };
// На данный момент длинна обычной и кастомной оси одинаковая
export const CUSTOM_Y_AXIS_WIDTH = 32;
export const SEC_AXIS_WIDTH = 30;
export const chartTextDark = 'rgba(255, 255, 255, 0.64)';
export const chartTextLight = 'rgba(0, 0, 0, 0.72)';
export const TITLE_HEIGHT = 12;
export const LETTER_WIDTH = 6;
export const TICK_LINE_WIDTH = 6;
export const GRID_COLOR = '#495057';
export const TOOLTIP_LINE_COLOR = '#EF5350';
export const TOOLTIP_BACKGROUND = '#515151';

export const tickLabelSize = 10;
export const tickLength = 4;
export const CUSTOM_AXIS_WIDTH = 32;
export const wordLength = 2;
export const scaleBandPadding = 0.1;

export const CROSS_PLOT_MARGIN = { top: 0, right: 0, bottom: 50, left: 80 };
export const CROSS_PLOT_PADDING_X = 200;
export const CROSS_PLOT_PADDING_Y = 100;

export const defaultStyleSetting: StyleSettings = {
  backgroundColor: '#fff',
  gridColor: GRID_COLOR,
  tooltipLineColor: TOOLTIP_LINE_COLOR,
  labelColor: GRID_COLOR,
  ticksColor: GRID_COLOR,
  tickLabelColor: GRID_COLOR,
  gradientFrom: '#C6C6C6',
  gradientTo: '#F8F8F8',
  gradientTicksColor: '#000',
  gradientLabelColor: '#000',
};

export const accessors = {
  xAccessor: (item: LinePathsItem) => item.x,
  yAccessor: (item: LinePathsItem) => item.y,
};

// Ниже в рассчетах подразумеваетя, что scaleX и scaleY одинаковые
export const INITIAL_TRANSFORM = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};
