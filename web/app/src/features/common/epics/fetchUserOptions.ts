import { Action, createAction } from '@reduxjs/toolkit';
import { StateObservable, ofType } from 'redux-observable';
import { Observable, forkJoin, map, mergeMap, of, switchMap } from 'rxjs';

import { ActionOut } from '@entities/store';
import { AppWriteCollection, createDocument, getDocuments } from '@shared/api';
import { setUser, setUserOptions } from '../commonSlice';
import { Query } from 'appwrite';

export const action = createAction('common/fetchUserOptions');

export const fetchUserOptionsEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) => {
  return action$.pipe(
    ofType(setUser.type),
    mergeMap(() => {
      const userId = state$.value.common.user?.$id ?? '';
      return forkJoin({
        activeTheme: getDocuments(AppWriteCollection.activeTheme, [Query.equal('userId', [userId])]).pipe(
          switchMap((res) => {
            const document = res.documents[0];
            return document
              ? of({ id: document.$id, value: document.value })
              : createDocument(AppWriteCollection.activeTheme, {
                  userId: userId,
                  value: 'light',
                }).pipe(map((res) => ({ id: res.$id, value: res.value })));
          }),
        ),
        openSideBar: getDocuments(AppWriteCollection.openSideBar, [Query.equal('userId', [userId])]).pipe(
          switchMap((res) => {
            const document = res.documents[0];
            return document
              ? of({ id: document.$id, value: document.value })
              : createDocument(AppWriteCollection.openSideBar, {
                  userId: userId,
                  value: true,
                }).pipe(map((res) => ({ id: res.$id, value: res.value })));
          }),
        ),
      });
    }),
    map((result) => {
      return setUserOptions(result) as ActionOut;
    }),
  );
};
