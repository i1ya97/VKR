import { OAuthProvider } from 'appwrite';
import { from, of } from 'rxjs';

import { account } from '../constants/account';

export const authorization = () => {
  return from(
    of(account.createOAuth2Session(OAuthProvider.Oidc, `${window.location.href}`, `${window.location.href}`)),
  );
};
