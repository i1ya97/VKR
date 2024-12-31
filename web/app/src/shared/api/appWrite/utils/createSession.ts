import { from } from 'rxjs';

import { account } from '../constants/account';

export const createSession = (secret: string, userId: string) => {
  return from(account.createSession(userId, secret));
};
