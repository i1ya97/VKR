import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Button, Card, IconButton, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { BorderBox } from './ui/BorderBox';
import { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { ForecastingChart } from './ui/ForecastingChart';
import { SettingChartDialog } from './ui/SettingChartDialog';
import { Curve, ForecastChart, Product } from './models';
import { fetchArticles, selectUser } from '@features/common';
import cloneDeep from 'lodash.clonedeep';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppWriteCollection, createDocument, getDocuments, updateDocument } from '@shared/api';
import { map, of, switchMap } from 'rxjs';
import { Query } from 'appwrite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

const ScrollStyled = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  gap: '16px',
  paddingRight: '8px',

  '&::-webkit-scrollbar': {
    backgroundColor: theme.palette.divider,
    height: 8,
    width: 8,
    borderRadius: 6,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 5,
  },
}));

const Root = styled('div')(({ }) => ({
  margin: '24px',
  gap: '16px',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100% - 48px)'
}));

export const Forecasting = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const [settingId, setSettingId] = useState<string>('');
  const [charts, setCharts] = useState<ForecastChart[]>([]);
  const [dateStart, setDateStart] = useState<dayjs.Dayjs | null>(null);
  const [dateEnd, setDateEnd] = useState<dayjs.Dayjs | null>(null);
  const [forecastChart, setForecastChart] = useState<ForecastChart | null>(null);

  useEffect(() => {
    dispatch(fetchArticles());
    getDocuments(AppWriteCollection.chartSettings, [Query.equal('userId', [user?.$id ?? ''])]).pipe(
      switchMap((res) => {
        const document = res.documents[0];
        return document
          ? of({ id: document.$id, settings: document.settings })
          : createDocument(AppWriteCollection.chartSettings, {
            userId: user?.$id ?? '',
            settings: JSON.stringify(charts),
          }).pipe(map((res) => ({ id: res.$id, settings: res.settings })));
      })).subscribe((res) => {
        setSettingId(res.id);
        setCharts(JSON.parse(res.settings));
      })
  }, []);

  const addChart = () => {
    setCharts((prev) => [...prev, {
      id: uuidv4(),
      name: 'Новый график',
      products: [],
      curves: []
    }])
  }

  const handleClickOpen = (chart: ForecastChart) => {
    setForecastChart(cloneDeep(chart));
  };

  const updateDB = (charts: ForecastChart[]) => {
    updateDocument(AppWriteCollection.chartSettings, settingId, {
      userId: user?.$id ?? '',
      settings: JSON.stringify(charts),
    }).subscribe();
  }

  const saveChangeSettings = (curves: Curve[], products: Product[]) => {
    const index = charts.findIndex((c) => c.id === forecastChart?.id);
    if (index >= 0 && forecastChart) {
      charts[index] = {
        ...forecastChart, curves, products
      }
      setCharts(charts);
    }
    setForecastChart(null);
    updateDB(charts);
  }

  const deleteChart = (id: string) => {
    setCharts(charts.filter((c) => c.id !== id));
    updateDB(charts.filter((c) => c.id !== id));
  }

  const changeDateStart = (value: dayjs.Dayjs | null) => {
    setDateStart(value);
  }

  const changeDateEnd = (value: dayjs.Dayjs | null) => {
    setDateEnd(value);
  }


  return (
    <Root>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Работа с прогнозом</Typography>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
      </Box>
      <ScrollStyled>
        {charts.map((chart) => (
          <Card key={chart.id} sx={{
            padding: '16px',
            width: '100%',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h6'>{
                chart.curves.length >= 1 ?
                  `Анализ показателей товара "${chart.products?.[0].name}"` : chart.products.length > 1 ?
                    `Сравнение товаров по "${chart.curves?.[0].name}"` :
                    'Новый график'
              }</Typography>
              <Box>
                <IconButton onClick={() => handleClickOpen(chart)}>
                  <SettingsIcon />
                </IconButton>
                <IconButton onClick={() => deleteChart(chart.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <ForecastingChart
              products={chart.products}
              curves={chart.curves}
              dateStart={dateStart}
              dateEnd={dateEnd}
            />
          </Card >
        ))}
        <BorderBox>
          <Button variant="text" fullWidth onClick={addChart}>Добавить график</Button>
        </BorderBox>
      </ScrollStyled>
      <SettingChartDialog
        forecastChart={forecastChart}
        setForecastChart={setForecastChart}
        saveChange={saveChangeSettings}
      />
    </Root>
  );
};
