import { catchError, forkJoin, of, switchMap } from 'rxjs';

import { authorization } from './authorization';
import { getAccount } from './getAccount';
import { getSession } from './getSession';

export const login = () => {
  return getAccount().pipe(
    catchError(() => authorization()),
    switchMap(() => getSession()),
    switchMap((res) =>
      forkJoin({
        session: of(res),
      }),
    ),
  );
};
