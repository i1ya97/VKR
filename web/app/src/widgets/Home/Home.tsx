import { fetchWeatherForecast, selectWeatherForecasts } from '@features/common';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { useEffect } from 'react';

export const Home = () => {
  const dispatch = useAppDispatch();

  const weatherForecasts = useAppSelector(selectWeatherForecasts);

  useEffect(() => {
    dispatch(fetchWeatherForecast());
  }, []);

  return (
    <Box sx={{ padding: '16px' }}>
      {weatherForecasts.map((w) => (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
          <Typography>{w.date}</Typography>
          <Typography>{w.temperatureC}</Typography>
          <Typography>{w.summary}</Typography>
        </Box>
      ))}
    </Box>
  );
};
