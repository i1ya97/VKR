import { Models } from 'appwrite/types/models';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import { login, updateToken } from '@shared/api';

interface Props {}

export const AuthProvider = (props: PropsWithChildren<Props>) => {
  const { children } = props;


  // useEffect(() => {
  //   login().subscribe((res) => {
  //     if (res.session) {
  //       setAuthState((prev) => ({
  //         ...prev,
  //         authorizedUser: true,
  //         session: res.session as Models.Session,
  //       }));
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   if (authState.session?.providerAccessTokenExpiry) {
  //     const timer = setTimeout(() => {
  //       updateToken().subscribe((acc) => {
  //         if (acc?.session)
  //           setAuthState((prev) => ({
  //             ...prev,
  //             session: { ...acc.session } as Models.Session,
  //           }));
  //       });
  //     }, 600000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [authState.session?.providerAccessTokenExpiry]);


  // return !authState?.authorizedUser && !authState.session ? (

  return children;
};
