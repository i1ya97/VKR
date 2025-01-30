
import { GraphsStyles } from './GraphsStyles';
import { ILinePath } from './ILinePath';
import { SecondaryAxis } from './SecondaryAxis';
import { ChartDataFiltered } from './ChartDataFiltered';
import { UseMarginOutput } from './UseMarginOutput';
import { UseDomainsOutput } from './UseDomainsOutput';
import { UseScaleOutput } from './UseScaleOutput';
import { Data } from './Data';

export type UseChartDataOutput = Pick<UseDomainsOutput, 'minValueForEntire' | 'minValuesForEachLine'> &
  UseScaleOutput & UseMarginOutput & {
    filteredChartData: ChartDataFiltered[];
    keys: string[];
    data: Data[];
    secondaryAxises: SecondaryAxis[] | null;
    marginLeft: number;
    marginTop: number;
    xMax: number;
    yMax: number;
    linePaths: ILinePath[];
    rangeZones: [number, number][][];
    graphsStyles: GraphsStyles | null;
  };
