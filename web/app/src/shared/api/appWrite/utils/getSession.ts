import { from } from 'rxjs';

import { account } from '../constants/account';

export const getSession = () => {
  return from(account.getSession('current'));
};
