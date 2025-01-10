import { PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios-observable';
import { catchError, of } from 'rxjs';

import { createJWT, getAccount } from '@shared/api';
import { selectUser, setUser } from '@features/common';
import { useAppDispatch, useAppSelector } from '@shared/hooks';

export const AuthProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectUser);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getAccount()
      .pipe(
        catchError(() => {
          navigate('/login');
          return of(null);
        }),
      )
      .subscribe((res) => {
        dispatch(setUser(res));
      });
  }, []);

  useLayoutEffect(() => {
    if (token) {
      Axios.defaults.headers = {
        ...Axios.defaults.headers,
        common: {
          ...Axios.defaults.headers.common,
          Authorization: token,
        },
      };
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      createJWT().subscribe((token) => {
        setToken(token.jwt);
      });
    }
  }, [user]);

  return user && token && children;
};
