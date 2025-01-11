import { AxisOptions } from './AxisOptions';
import { BarInfo } from './BarInfo';
import { HistogramData } from './HistogramData';
import { HistogramType } from './HistogramType';
import { Orientation } from './Orientation';
import { VerticalLine } from './VerticalLine';

export type HistogramProps = {
  // данные для гистограммы
  data: HistogramData[];
  // информация о столбцах гистограммы
  barsInfo: BarInfo;
  // тип гистограммы (cardinal, relative) (по умолчанию cardinal)
  histogramType?: HistogramType;
  // ориентация гистограммы (horizontal, vertical) (по умолчанию vertical)
  orientation?: Orientation;
  // отступ между группами столбцов (по умолчанию 0.2)
  paddingBarGroup?: number;
  // отступ между столбцами (по умолчанию 0.2)
  paddingBar?: number;
  // количество тиков по оси X (по умолчанию 5)
  numTicksX?: number;
  // количество тиков по оси Y (по умолчанию 5)
  numTicksY?: number;
  // вариант отображения сетки по оси Y (по умолчанию '4')
  gridRowsDasharray?: string;
  // вариант отображения сетки по оси X (по умолчанию '4')
  gridColumnsDasharray?: string;
  // скрыть сетку по оси Y
  hideGridRows?: boolean;
  // скрыть сетку по оси X (true)
  hideGridColumns?: boolean;
  // скрыть легенду
  disableLegend?: boolean;
  // опции оси X
  axisBottomOptions?: AxisOptions;
  // опции оси Y
  axisLeftOptions?: AxisOptions;
  // дополнительные линейные линии по вертикали
  verticalLines?: VerticalLine[];
  style?: {
    // цвет текста
    textColor?: string;
    // цвет сетки
    gridColor?: string;
    // цвет заднего фона легенды
    backgroundLegend?: string;
  };
};
