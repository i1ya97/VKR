import { Models } from 'appwrite';
import { UserOptions } from './UserOptions';
import { ApiCredentions } from './ApiCredentions';

export interface CommonState {
  user: Models.User<Models.Preferences> | null;
  theme: UserOptions<'dark' | 'light'>;
  openSideBar: UserOptions<boolean>;
  ozonApiCredentions: ApiCredentions | null;
  uploadLogs: Record<string, string>[];
  articles: Record<string, string>[];
  residues: Record<string, string>[];
}
