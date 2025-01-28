import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Table from '@shared/ui/Table';
import { columns } from './constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { 
  fetchResidues, selectDateEnd, selectDateStart, 
  selectResidues, setDateEnd, setDateStart, setResidues 
} from '@features/common';
import CircularProgress from '@mui/material/CircularProgress';

export const ResidueControl = () => {

  const [maxForecastFBO, setMaxForecastFBO] = useState<number>(120)

  const dispatch = useAppDispatch();

  const residues = useAppSelector(selectResidues);
  const dateStart = useAppSelector(selectDateStart);
  const dateEnd = useAppSelector(selectDateEnd);

  useEffect(() => {
    dispatch(setResidues({ rows: [], loading: true }));
    dispatch(fetchResidues());
  }, [])


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
    return { value: value.toString() };
  }

  const changeDateStart = (value: dayjs.Dayjs | null) => {
    dispatch(setDateStart(value))
  }

  const changeDateEnd = (value: dayjs.Dayjs | null) => {
    dispatch(setDateEnd(value))
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h4">Контроля остатков</Typography>
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
              onChange={changeDateEnd}
            />
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
      {residues.loading ? (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : !!residues.rows.length ? (
        <Table
          rows={residues.rows}
          rowSize={50}
          columns={columns}
          getValue={getValue}
        />
      ) : (
        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='h5'>Нет данных</Typography>
        </Box>
      )}
    </Box>
  );
};
