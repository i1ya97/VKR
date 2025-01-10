import { Models } from 'appwrite';
import { WeatherForecast } from './WeatherForecast';
import { UserOptions } from './UserOptions';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: UserOptions<'dark' | 'light'>;
  weatherForecasts: WeatherForecast[];
  openSideBar: UserOptions<boolean>;
}
