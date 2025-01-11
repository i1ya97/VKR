import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { DonutChart, Histogram } from '@shared/charts';
import { useMemo } from 'react';
import { generateWeeklySales } from './utils/generateWeeklySales';
import { generateWeeklySalesByCategory } from './utils/generateWeeklySalesByCategory';

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

  const theme = useTheme();

  const weeklySales = useMemo(() => generateWeeklySales(theme), [theme])

  const weeklySalesByCategory = useMemo(() => generateWeeklySalesByCategory(theme), [theme]);

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Дашборд</Typography>
      <Divider />
      <Box sx={{
        display: 'grid', gridTemplateRows: 'repeat(1, 450px)',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
        <ChartBox>
          <Typography variant="subtitle1">Продажы за неделю</Typography>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Histogram {...weeklySales} />
          </Box>
        </ChartBox>
        <ChartBox>
          <Typography variant="subtitle1">Продажы за неделю по категориям</Typography>
          <DonutChart {...weeklySalesByCategory} />
        </ChartBox>
      </Box>
    </Box>
  );
};
