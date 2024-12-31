import { from } from 'rxjs';

import { account } from '../constants/account';

export const getAccount = () => {
  return from(account.get());
};
