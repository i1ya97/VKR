import { LETTER_WIDTH, TICK_LINE_WIDTH, TITLE_HEIGHT } from "../constants";

export function calcAxisWidth(tickWidth: number) {
  // TITLE_HEIGHT умножаем на 2, тк нужен отступ от названия оси до следующей
  return tickWidth * LETTER_WIDTH + TICK_LINE_WIDTH + TITLE_HEIGHT * 2;
}
