import { ChartData, KeyValue } from "../models/ChartData";

// Данные по одному объекты должны иметь один и тот же скейл
export const concatSimilarData = (
  chartData: ChartData[],
  groupByProperty?: keyof Omit<
    ChartData,
    'styleSettings' | 'data' | 'oppositeSecondaryAxisSide' | 'isDefined' | 'reverse'
  >,
): ChartData[] => {
  // todo медленно работает, нужна оптимизация
  const squashed = chartData.reduce((squashed, cd) => {
    if (!cd[groupByProperty ?? 'additionalName']) return squashed;

    if (!squashed[cd[groupByProperty ?? 'additionalName']!]) {
      squashed[cd[groupByProperty ?? 'additionalName']!] = [];
    }

    squashed[cd[groupByProperty ?? 'additionalName']!] = squashed[cd[groupByProperty ?? 'additionalName']!].concat(
      cd.data,
    );
    return squashed;
  }, {} as Record<string, KeyValue[]>);

  return chartData.map((cd) => {
    if (!cd[groupByProperty ?? 'additionalName']) return cd;
    return {
      ...cd,
      data: squashed[cd[groupByProperty ?? 'additionalName']!],
    };
  });
};
