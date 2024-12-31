import { Query } from 'appwrite';
import { from, map } from 'rxjs';

import { account } from '../constants/account';

export const getIdentities = (userId: string) => {
  return from(account.listIdentities([Query.equal('userId', [userId])])).pipe(map((res) => res.identities?.[0]));
};
