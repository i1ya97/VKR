import { Models } from 'appwrite';
import { WeatherForecast } from './WeatherForecast';
import { UserOptions } from './UserOptions';
import { ApiCredentions } from './ApiCredentions';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: UserOptions<'dark' | 'light'>;
  openSideBar: UserOptions<boolean>;
  ozonApiCredentions: ApiCredentions | null;
}
