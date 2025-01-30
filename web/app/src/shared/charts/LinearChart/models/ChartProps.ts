import { ManipulateType } from 'dayjs';
import { AdditionalLine } from './AdditionalLine';
import { ChartData, StyleSettings } from './ChartData';
import { ChartDataFiltered } from './ChartDataFiltered';
import { Range } from './Range';

export interface ChartProps {
  /**
   * ID графика для использования в специфичном функционале (в основном для взаимодействия с внешними системами).
   * */
  chartId?: string;
  width: number;
  height: number;
  /**
   * Для отображения точек на простой прямой достаточно задать всего 2 координаты и указать активным флаг generateMissingPoints.
   * */
  chartData: ChartData[];
  margin?: { top: number; right: number; bottom: number; left: number };
  mainAxisLabel?: string;
  /**
   * Игнорируется при активном secondaryAxisForEachData.
   * */
  secondaryAxisLabel?: string;
  mainAxisTicksNumber?: number;
  secondaryAxisTicksNumber?: number;
  mainAxisTickFormat?: (value: any) => string | undefined;
  secondaryAxisTickFormat?: (value: any) => string | undefined;
  /**
   * Генерирует пропущенные ключи для всех линий на основной оси.
   * Значения для ключей рассчитываются автоматически.
   * Если у всех массивов данных ключи идентичны, флаг не нужен.
   * По умолчанию false.
   * */
  generateMissingPoints?: boolean;
  /**
   * По умолчанию false.
   * */
  nameSelection?: boolean;
  mainAxisType?: MainAxisType;
  /**
   * По умолчанию false.
   * */
  disableLegend?: boolean;
  legendHeight?: number;
  legendPosition?: 'top' | 'bottom';
  /**
   * По умолчанию true.
   * */
  legendCheckboxes?: boolean;
  /**
   * Внешний обработчик
   * */
  onLegendChange?: (checked: boolean[]) => void;
  linearType?: LinearChartType;
  /**
   * По умолчанию false.
   * */
  enableTooltip?: boolean;
  /**
   * Альтернативный вариант отображения вторичной оси.
   * Недоступно при активном secondaryAxisForEachData.
   * Пока что не работает для перевернутого графика (switchAxises).
   * По умолчанию false.
   * */
  customSecondaryAxis?: boolean;
  /**
   * Отображение отдельной вторичной оси для каждого массива данных.
   * Недоступно при активном customSecondaryAxis.
   * По умолчанию false.
   * */
  secondaryAxisForEachData?: boolean;
  /**
   * Отображает вторичную ось в противоположной стороне графика.
   * По умолчанию false.
   * */
  switchSecondaryAxisPosition?: boolean;
  /**
   * Отображает основную ось в противоположной стороне графика.
   * По умолчанию false.
   * */
  switchMainAxisPosition?: boolean;
  /**
   * Горизонтальные линии, не влияющие на построение данных.
   * */
  additionalLines?: AdditionalLine[];
  /**
   * Генерирует области выхода данных за указанный предел.
   * */
  range?: Range;
  /**
   * По умолчанию false.
   * */
  mainAxisGridEnabled?: boolean;
  /**
   * По умолчанию true.
   * */
  secondaryAxisGridEnabled?: boolean;
  /**
   * Отрисовывать график, начиная с 0ых координат, даже если на них отсутствуют данные.
   * По умолчанию false.
   * */
  startFromZeroCoordinates?: boolean;
  styleSettings?: StyleSettings;
  /**
   * По умолчанию false.
   * */
  hideAxisLine?: boolean;
  /**
   * Если линия обрывается посреди графика,
   * она будет "растянута" дальше на той же второстепенной координате (в виде прямой линии).
   * По умолчанию false.
   * */
  continueLineData?: boolean;
  /**
   * Обозначение линий возле каждой легенды.
   * По умолчанию false.
   * */
  linePreview?: boolean;
  /**
   * Если активен - области данных будут накладываться друг на друга.
   * По умолчанию false.
   * */
  accumulate?: boolean;
  /**
   * Округлять данные на осях. Данные могут быть искажены.
   * По умолчанию true.
   * */
  nice?: boolean;
  /**
   * Отразить данные по X.
   * По умолчанию false.
   * */
  reverseMainAxis?: boolean;
  /**
   * Отразить данные по Y.
   * По умолчанию false.
   * */
  reverseSecondaryAxis?: boolean;
  /**
   * Меняет основную и вторичную оси местами (поворачивает данные на 90 вправо).
   * Позиция тултипа будет рассчитываться относительно основной оси, то есть Y оси, а его линия станет горизонтальной.
   * По умолчанию false.
   * */
  switchAxises?: boolean;
  /**
   * Отображать точки на линиях.
   * По умолчанию false.
   * */
  showPoints?: boolean;
  /**
   * Разделять большие числовые значения на осях запятой.
   * Недоступно при указанном форматировщике данных для конкретной оси,
   * а так же для основной при датированном типе (mainAxisType === 'time').
   * По умолчанию true.
   * */
  separateTicksDigits?: boolean;
  /**
   * Отображать границу графика.
   * По умолчанию false.
   * */
  showBorder?: boolean;
  /**
   * Производить группировку по значениям ключей у chartData.
   * Вторичные оси будут отображаться по уникальным значениям,
   * а данные для этих же ключей будут отображаться, используя 1 общий для них скейл
   * и, при наличии, объединенные ограничения доменов (minDomain и maxDomain).
   * */
  groupByProperty?: keyof Omit<
    ChartData,
    'styleSettings' | 'data' | 'oppositeSecondaryAxisSide' | 'isDefined' | 'reverse'
  >;
  /**
   * Используется для однократного отбражения уникальных параметров
   * в легенде.
   * По умолчанию key (отображаются все параетры)
   * */
  uniqueLegendKey?:
    | keyof Omit<ChartData, 'styleSettings' | 'data' | 'oppositeSecondaryAxisSide' | 'isDefined' | 'reverse'>
    | 'key';
  /**
   * Определяет тип тултипа.
   * ('default' | 'table' | 'list')
   * По умолчанию 'default'
   * */
  tooltipType?: TooltipType;
  /**
   * Пока что не используется
   * Переопределяет тип тултипа при отображении единственного объекта (парамметров может быть несколько).
   * ('default' | 'table' | 'list')
   * По умолчанию 'list'
   * */
  tooltipTypeForSingleObject?: TooltipType;
  /**
   * Генерирует название для каждой вторичной оси.
   * По умолчанию используетмя alias.
   * */
  secondaryAxisForEachDataLabel?: (axis: ChartDataFiltered) => string;
  /**
   * Тип отображаемых точек данных на графике при скролле.
   * По умолчанию 'h'.
   * */
  scrollTypeOfTimeDataPoints?: ManipulateType;
  /**
   * ID внешнего DOM-элемента для задания позиции тултипа из вне (синхронизация тултипов между графиками).
   */
  tooltipPointExternalDomId?: string;
  /**
   * ID внешнего DOM-элемента для задания горизонтальных отступов из вне (синхронизация отступов между графиками).
   */
  maxMarginsExternalDomId?: string;
  /**
   * ID внешнего DOM-элемента для задания коэффициента зуммирования из вне (синхронизация зуммирования между графиками).
   */
  zoomExternalDomId?: string;
  /**
   * ID внешнего DOM-элемента для задания позиции скролла из вне (синхронизация зуммирования между графиками).
   */
  scrollExternalDomId?: string;
}


export type TooltipType = 'DEFAULT' | 'TABLE' | 'LIST';

export type MainAxisType = 'time' | 'numeric';

export type LinearChartType = 'linear' | 'basis' | 'cardinal' | 'natural' | 'catmullRom';