import { from } from 'rxjs';

import { account } from '../constants/account';

export const deleteSession = () => {
  return from(account.deleteSession('current'));
};
