import { from } from 'rxjs';

import { account } from '../constants/account';

export const updatePassword = (password: string, oldPassword: string) => from(account.updatePassword(password, oldPassword));
