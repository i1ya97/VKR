export type AxisOptions = {
  // скрыть тики на оси
  hideTicks?: boolean;
  // скрыть линию оси
  hideAxisLine?: boolean;
  // скрыть нулевые значения на оси
  hideZero?: boolean;
  // скрыть подписи к тикам на оси
  hideLabel?: boolean;
  // формат вывода тиков на оси
  tickFormat?: <T>(value: T) => string;
};
