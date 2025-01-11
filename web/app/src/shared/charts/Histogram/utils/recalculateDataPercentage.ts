import { HistogramData } from '../../models/HistogramData';

export const recalculateDataPercentage = (data: HistogramData[], keys: string[]) => {
  return data.map((d) => {
    const sum = Object.values(d)
      .filter((d) => typeof d === 'number')
      .reduce((acc, d) => acc + +d, 0);
    if (!sum) return d;
    return {
      ...d,
      ...keys.reduce((acc, key) => {
        acc[key] = ((+(d[key] ?? 0)) / sum) * 100;
        return acc;
      }, {} as HistogramData),
    };
  });
};
