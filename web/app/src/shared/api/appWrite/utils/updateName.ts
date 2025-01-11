import { from } from 'rxjs';

import { account } from '../constants/account';

export const updateName = (name: string) => from(account.updateName(name));
