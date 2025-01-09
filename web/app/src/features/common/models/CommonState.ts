import { Models } from 'appwrite';
import { WeatherForecast } from './WeatherForecast';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: 'dark' | 'light';
  weatherForecasts: WeatherForecast[];
}
