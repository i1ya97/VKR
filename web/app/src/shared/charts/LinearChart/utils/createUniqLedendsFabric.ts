import { createArrayToMap, createMapToArray } from 'struct-tools';
import { ChartDataFiltered } from '../models/ChartDataFiltered';
import { CheckedLegend } from '../models/CheckedLegend';
import { ChartProps } from '../models/ChartProps';

const hashTransformer = (keyToCDPair: [string, CheckedLegend]): CheckedLegend => {
  return keyToCDPair[1];
};

const createUniqLegends = createMapToArray(hashTransformer);

export function createUniqLegendsFabric(uniqKey: ChartProps['uniqueLegendKey']) {
  const chartDataExtractor = (ld: ChartDataFiltered): [string, CheckedLegend] => {
    const { data, ...otherLD } = ld;

    return [String(ld[uniqKey]), { ...otherLD, isChecked: true }];
  };
  const createChartDataHash = createArrayToMap(chartDataExtractor);

  return (cd: ChartDataFiltered[]) => createUniqLegends(createChartDataHash(cd));
}
