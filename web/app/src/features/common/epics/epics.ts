import { fetchUserOptionsEpic } from './fetchUserOptions';
import { fetchWeatherForecastEpic } from './fetchWeatherForecastEpic';

export const commonEpics = [fetchWeatherForecastEpic, fetchUserOptionsEpic];
