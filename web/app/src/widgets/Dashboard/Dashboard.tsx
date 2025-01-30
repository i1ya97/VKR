import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DonutChart, Histogram } from '@shared/charts';
import { useEffect, useMemo } from 'react';
import { generateWeeklySales } from './utils/generateWeeklySales';
import { generateWeeklySalesByCategory } from './utils/generateWeeklySalesByCategory';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  fetchArticles, setDashboardDateEnd, setDashboardDateStart,
  selectDashboardDateEnd, selectDashboardDateStart, setDashboardChart,
} from '@features/common';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { selectDashboardChart } from '@features/common/selectors';
import { CircularProgress } from '@mui/material';

const ChartBox = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  height: '100%',
  padding: '16px',
  borderRadius: '8px',
}));

export const Dashboard = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchArticles());
    dispatch(setDashboardChart({ loading: true }));
  }, []);

  const dateStart = useAppSelector(selectDashboardDateStart);
  const dateEnd = useAppSelector(selectDashboardDateEnd);
  const dashboardChart = useAppSelector(selectDashboardChart);

  const changeDateStart = (value: dayjs.Dayjs | null) => {
    dispatch(setDashboardDateStart(value))
  }

  const changeDateEnd = (value: dayjs.Dayjs | null) => {
    dispatch(setDashboardDateEnd(value))
  }

  const theme = useTheme();

  const weeklySales = useMemo(() =>
    generateWeeklySales(theme, dashboardChart?.sales?.data ?? [], dashboardChart?.sales?.barsInfo ?? {})
    , [theme, dashboardChart]
  )

  const weeklySalesByCategory = useMemo(() =>
    generateWeeklySalesByCategory(theme, dashboardChart?.salesByCategory?.values ?? [])
    , [theme, dashboardChart]
  );

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Дашборд</Typography>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Typography>Укажите период:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={dateStart}
              onChange={changeDateStart}
            />
            —
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={dateEnd}
              maxDate={dayjs()}
              onChange={changeDateEnd}
            />
          </LocalizationProvider>
        </Box>
      </Box>
      <Box sx={{
        display: 'grid', gridTemplateRows: 'repeat(1, 450px)',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        <ChartBox>
          <Typography variant="subtitle1">Продажы за период</Typography>
          {dashboardChart.loading ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : !!dashboardChart.sales?.data.length ? (
            <Box sx={{ width: '100%', height: '100%' }}>
              <Histogram {...weeklySales} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant='h5'>Нет данных</Typography>
            </Box>
          )}
        </ChartBox>
        <ChartBox>
          <Typography variant="subtitle1">Продажы за период по категориям</Typography>
          {dashboardChart.loading ? (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : !!dashboardChart.salesByCategory?.values.length ? (
            <DonutChart {...weeklySalesByCategory} />
          ) : (
            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant='h5'>Нет данных</Typography>
            </Box>
          )}
        </ChartBox>
      </Box>
    </Box>
  );
};
