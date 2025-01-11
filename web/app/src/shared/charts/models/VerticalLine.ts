export type VerticalLine = {
  // значение точки по оси Y
  y: number;
  // цвет линии
  color: string;
  // скрыть подпись к линии
  hideLabel?: boolean;
  // вариант отображения сетки по оси
  strokeDasharray?: string;
};
