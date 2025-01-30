export interface ChartData {
  // Используется как имя объекта. Часть критерия уникальности
  name: string;
  // Используется как имя параметра объекта. Часть критерия уникальности
  additionalName?: string;
  // Используется для отображения названия объекта, его легенды и тп
  alias: string;
  // Используется для отображения названия параметра, его легенды и тп
  additionalAlias?: string;
  /** @deprecated используйте stroke в styleSettings */
  color?: string;
  /** @deprecated используйте strokeDasharray в styleSettings */
  dasharray?: string;
  dimension?: string;
  // Переопределяет минимальное (доменное) значение для конкретного графа
  minDomain?: number;
  // Переопределяет максимальное (доменное) значение для конкретного графа
  maxDomain?: number;
  // определяет сколько символов после запятой отображать в тултипе (работает только с TABLE)
  tooltipFixedCount?: number;
  /**
   * Используйте, если нужно отразить только конкретные данные по вторичной оси.
   * Если нужно отразить весь график, используйте reverseSecondaryAxis.
   * */
  reverse?: boolean;
  dotsType?: 'only' | 'hide' | 'display';
  // учитывать разрывы
  isDefined?: boolean;
  styleSettings?: GraphStyle;
  data: KeyValue[];
  /**
   * Отображать вторичную ось с противоположной стороны.
   * */
  oppositeSecondaryAxisSide?: boolean;
}

export interface KeyValue {
  key: string | number;
  value: number;
}

export type GraphStyle = {
  stroke: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  /*
   * Пропсы для стандартных маркеров (точек на графике).
   * Этот параметр применяется только к текущей группе моделей
   * Если нужно изменть все оси - укажите тот же пропс в парметрах кросс-плота (в StyleSettings)
   * */
  markerProps?: StyleSettings['markerProps'];
  /*
   * Вы можете использовать *polygon* для отображения маркеров (точек на графике)
   * Polygon должет быть размером 8*8.
   * Этот параметр применяется только к текущей группе моделей
   * Если нужно изменть все оси - укажите тот же пропс в парметрах кросс-плота (в StyleSettings)
   * */
  markerCustomProps?: StyleSettings['markerCustomProps'];
};

import { SVGProps } from 'react';

type RecursiveTypes = 'ref';

export type StyleSettingsBase = {
  /*
   * Пропсы для стандартных маркеров (точек на кросс-плоте).
   * Этот пропс применяется к маркерам на всех осях.
   * Если нужно изменть конкретную ось - укажите тот же пропс в парметрах группы моделей (в CrossPlotModel)
   * */
  markerProps?: Omit<SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'onMouseEnter' | 'onMouseLeave' | RecursiveTypes>;
  /*
   * Вы можете использовать *polygon* для отображения маркеров (точек на кросс-плоте)
   * Polygon должет быть размером 8*8.
   * Этот пропс применяется к маркерам на всех осях.
   * Если нужно изменть конкретную ось - укажите тот же пропс в парметрах группы моделей (в CrossPlotModel)
   * */
  markerCustomProps?: Omit<SVGProps<SVGPolygonElement>, RecursiveTypes>;
};

export type StyleSettings = {
  backgroundColor?: string;
  gridColor?: string;
  gridDasharray?: string;
  tooltipLineColor?: string;
  ticksColor?: string;
  tickLabelColor?: string;
  labelColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientTicksColor?: string;
  gradientLabelColor?: string;
  tooltipBackground?: string;
  legendItemColor?: string;
  defaultAxisColor?: string;
} & StyleSettingsBase;
