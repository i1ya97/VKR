import { catchError, forkJoin, of, switchMap } from 'rxjs';

import { authorization } from './authorization';
import { deleteSession } from './deleteSession';
import { updateSession } from './updateSession';

export const updateToken = () => {
  return updateSession().pipe(
    catchError(() => {
      return deleteSession().pipe(switchMap(() => authorization()));
    }),
    switchMap((res) =>
      forkJoin({
        session: of(res),
      }),
    ),
  );
};
