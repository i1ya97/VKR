import { from } from 'rxjs';

import { account } from '../constants/account';

export const updateSession = () => {
  return from(account.updateSession('current'));
};
