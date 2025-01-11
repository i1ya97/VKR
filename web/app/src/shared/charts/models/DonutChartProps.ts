import { DonutItem } from './DonutItem';

export type DonutChartProps = {
  donutItems: DonutItem[];
  /**
   * Цвет текста.
   * По умолчанию "white".
   **/
  textColor?: string;
  /**
   * Основная надпись в центре
   **/
  title?: string;
  /**
   * Дополнительная надпись в центре
   **/
  subTitle?: string;
  /**
   * Единицы измерения
   **/
  unit?: string;
  /**
   * Скрыть легенду
   * По умолчанию false.
   **/
  disableLegend?: boolean;
  /**
   * Скрыть значения в легенде
   * По умолчанию false.
   **/
  disableValueLegend?: boolean;
  /**
   * Скрыть проценты в легенде
   * По умолчанию false.
   **/
  disablePercentagesLegend?: boolean;
  /**
   * Скрыть названия в легенде
   * По умолчанию false.
   **/
  disableNameLegend?: boolean;
  /**
   * Скрыть цвета в легенде
   * По умолчанию false.
   **/
  disableColorLegend?: boolean;
  /**
   * Скрыть надписи на секторе
   * По умолчанию false.
   **/
  disablePieTitle?: boolean;
  /**
   * Скрыть единицы измерения в подписи на pie
   * По умолчанию false.
   **/
  disableUnitTitle?: boolean;
  /**
   * Тип сортировки
   * По умолчанию отключена.
   **/
  useSorting?: 'ASC' | 'DESC';
  /**
   * Отступ по краям
   * По умолчанию 15px.
   **/
  padding?: number;
};
