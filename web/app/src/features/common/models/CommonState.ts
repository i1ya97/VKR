import { Models } from 'appwrite';
import { UserOptions } from './UserOptions';
import { ApiCredentions } from './ApiCredentions';
import { TableData } from './TableData';
import dayjs from 'dayjs';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: UserOptions<'dark' | 'light'>;
  openSideBar: UserOptions<boolean>;
  ozonApiCredentions: ApiCredentions | null;
  uploadLogs: TableData;
  articles: TableData;
  residues: TableData;
  dateStart: dayjs.Dayjs| null,
  dateEnd: dayjs.Dayjs| null,
}
