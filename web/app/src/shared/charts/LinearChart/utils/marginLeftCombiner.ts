import { DEFAULT_MARGIN } from '../constants';
import { calcAxisWidth } from './calcAxisWidth';

export function marginLeftCombiner(previousMarginLeft = DEFAULT_MARGIN.left) {
  return function (maxTickWidth: number) {
    return (previousMarginLeft += calcAxisWidth(maxTickWidth));
  };
}
