import { from } from 'rxjs';

import { account } from '../constants/account';

export const createJWT = () => {
  return from(account.createJWT());
};
