import { from } from 'rxjs';

import { account } from '../constants/account';

export const createEmailSession = (email: string, password: string) => {
  return from(account.createEmailPasswordSession(email, password));
};
