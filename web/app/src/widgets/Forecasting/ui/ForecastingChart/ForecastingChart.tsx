import { ParentSize } from '@visx/responsive';
import dayjs from 'dayjs';
import { memo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useChartData } from './hooks/useChartData';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { LinearChart } from '@shared/charts';
import { ChartDataFiltered } from '@shared/charts/LinearChart/models/ChartDataFiltered';
import { Curve, Product } from '@widgets/Forecasting/models';

type Props = {
  products: Product[],
  curves: Curve[]
  dateStart: dayjs.Dayjs | null
  dateEnd: dayjs.Dayjs | null
};

export const ForecastingChart = memo((props: Props) => {

  const { products, curves, dateStart, dateEnd } = props;

  const { chartData, loading } = useChartData(products, curves, dateStart, dateEnd);

  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!products.length || !curves.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h5">Необходимо настроить график</Typography>
      </Box>
    );
  }

  if (!loading && !chartData?.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="h5">Нет данных</Typography>
      </Box>
    );
  }

  return (
    <ParentSize key={uuidv4()} debounceTime={10}>
      {({ width, height }) => (
        <LinearChart
          type='linear'
          linearType='linear'
          width={width}
          height={height}
          chartData={chartData ?? []}
          enableTooltip
          styleSettings={{
            backgroundColor: theme.palette.background.default,
            tickLabelColor: theme.palette.text.primary,
            ticksColor: theme.palette.text.primary,
          }}
          tooltipType='DEFAULT'
          showPoints
          groupByProperty='additionalName'
          generateMissingPoints
          startFromZeroCoordinates
          nice={false}
          separateTicksDigits={false}
          secondaryAxisForEachData
          legendCheckboxes={false}
          legendPosition='bottom'
          legendHeight={30}
          linePreview
          margin={{ top: 5, right: 0, bottom: 30, left: 0 }}
          uniqueLegendKey='name'
          mainAxisType='time'
          mainAxisTicksNumber={10}
          mainAxisTickFormat={(v: string) => dayjs.utc(v).format('DD.MM.YYYY HH:mm')}
          secondaryAxisForEachDataLabel={(cd: ChartDataFiltered) => `${cd.dimension ?? ''}`}
        />
      )}
    </ParentSize>
  );
});
