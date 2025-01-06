import { from } from 'rxjs';

import { account } from '../constants/account';
import { ID } from '../constants/Id';

export const createAccount = (email: string, password: string, name: string) => {
  return from(account.create(ID.unique(), email, password, name));
};
