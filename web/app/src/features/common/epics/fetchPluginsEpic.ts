import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, filter, map, mergeMap, of, switchMap } from 'rxjs';

import { ActionOut } from '@entities/store';
import { AppWriteCollection, createDocument, getDocuments } from '@shared/api';
import { setPluginsConfig, setUser } from '../commonSlice';
import { Query } from 'appwrite';

export const action = createAction('common/fetchPluginsEpic');

export const fetchPluginsEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(setUser.type),
    filter(() => {
      return !!state$.value.common.user?.$id
    }),
    mergeMap(() => {
      const userId = state$.value.common.user?.$id ?? '';
      return getDocuments(AppWriteCollection.pluginsConfig, [Query.equal('userId', [userId])]).pipe(
        switchMap((res) => {
          const document = res.documents[0];
          return document
            ? of({
              id: document.$id,
              plugins: JSON.parse(document.plugins),
              pluginsTimeSeries: JSON.parse(document.pluginsTimeSeries)
            })
            : createDocument(AppWriteCollection.pluginsConfig, {
              userId: userId,
              plugins: JSON.stringify([]),
              pluginsTimeSeries: JSON.stringify([]),
            }).pipe(map((res) => ({
              id: res.$id,
              plugins: JSON.parse(res.plugins),
              pluginsTimeSeries: JSON.parse(res.pluginsTimeSeries)
            })));
        }),
      );
    }),
    map((result) => {
      return setPluginsConfig(result) as ActionOut;
    }),
  );
};
