import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, map, mergeMap, of, switchMap } from 'rxjs';

import { ActionOut } from '@entities/store';
import { AppWriteCollection, createDocument, getDocuments } from '@shared/api';
import { setOzonApiCredentions, setUser } from '../commonSlice';
import { Query } from 'appwrite';

export const action = createAction('common/fetchApiCredentions');

export const fetchApiCredentionsEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(setUser.type),
    mergeMap(() => {
      const userId = state$.value.common.user?.$id ?? '';
      return getDocuments(AppWriteCollection.apiCredentions, [Query.equal('userId', [userId]), Query.equal('target', ['OZON'])]).pipe(
        switchMap((res) => {
          const document = res.documents[0];
          return document
            ? of({ id: document.$id, client: document.client, token: document.token })
            : createDocument(AppWriteCollection.apiCredentions, {
                userId: userId,
                target: 'OZON',
                client: null,
                token: null,
              }).pipe(map((res) => ({ id: res.$id, client: res.client, token: res.token  })));
        }),
      );
    }),
    map((result) => {
      return setOzonApiCredentions(result) as ActionOut;
    }),
  );
};
