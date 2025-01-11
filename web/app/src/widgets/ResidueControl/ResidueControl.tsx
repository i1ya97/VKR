import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns, products } from './constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export const ResidueControl = () => {

  const [maxForecastFBO, setMaxForecastFBO] = useState<number>(120)

  const getValue = (row: Record<string, string>, key: string): { value: string; color?: string } => {
    const value = row[key];
    if (key === 'averageOrder') return { value: (+row.ordered / 14).toFixed(3) }
    if (key === 'turnoverForecastFBO') {
      const turnoverForecastFBO = +row.fbo / (+row.ordered / 14);
      if (turnoverForecastFBO > maxForecastFBO) {
        return { value: turnoverForecastFBO.toFixed(3), color: 'red' }
      }
      return { value: (+row.fbo / (+row.ordered / 14)).toFixed(3) }
    }
    return { value };
  }


  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Контроля остатков</Typography>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Typography>Укажите период:</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
            <DatePicker slotProps={{ textField: { size: 'small' } }} value={dayjs.utc().add(-14, 'day')} disabled />
            —
            <DatePicker slotProps={{ textField: { size: 'small' } }} value={dayjs.utc()} disabled />
          </LocalizationProvider>
        </Box>
        <TextField
          size="small"
          type='number'
          value={maxForecastFBO}
          onChange={(e) => setMaxForecastFBO(+e.target.value)}
          label="Допустимая оборачиваемость"
          variant="outlined"
        />
      </Box>
      <Table
        rows={products}
        rowSize={50}
        columns={columns}
        getValue={getValue}
      />
    </Box>
  );
};
