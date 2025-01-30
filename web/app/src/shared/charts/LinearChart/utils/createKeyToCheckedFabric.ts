import { createArrayToMap } from 'struct-tools';
import { ChartProps } from '../models/ChartProps';
import { CheckedLegend } from '../models/CheckedLegend';

export function createKeyToCheckedFabric(uniqKey: ChartProps['uniqueLegendKey']) {
  const isCheckedExtractor = (cl: CheckedLegend): [string, boolean] => {
    return [String(cl[uniqKey]), cl.isChecked];
  };
  const createChartDataHash = createArrayToMap(isCheckedExtractor);

  return (cl: CheckedLegend[]) => createChartDataHash(cl);
}
