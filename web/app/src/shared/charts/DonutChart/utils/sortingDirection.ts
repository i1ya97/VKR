import { DonutItem } from '../../models/DonutItem';

export const sortingDirection = (a: DonutItem, b: DonutItem, useSorting?: 'ASC' | 'DESC') => {
  if (!useSorting) return 1;
  return useSorting === 'ASC' ? b.value - a.value : a.value - b.value;
};
