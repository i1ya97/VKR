import { Models } from 'appwrite';
import { UserOptions } from './UserOptions';
import { ApiCredentions } from './ApiCredentions';
import { TableData } from './TableData';
import dayjs from 'dayjs';
import { DashboardChart } from './DashboardChart';
import { PluginOption } from '@shared/models/Plugin';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: UserOptions<'dark' | 'light'>;
  openSideBar: UserOptions<boolean>;
  ozonApiCredentions: ApiCredentions | null;
  uploadLogs: TableData;
  articles: TableData;
  residues: TableData;
  dateStart: dayjs.Dayjs | null,
  dateEnd: dayjs.Dayjs | null,
  dashboardDateStart: dayjs.Dayjs | null,
  dashboardDateEnd: dayjs.Dayjs | null,
  dashboardChart: DashboardChart,
  pluginsConfig: {
    id: string;
    plugins: PluginOption[],
    pluginsTimeSeries: PluginOption[],
  }
}
