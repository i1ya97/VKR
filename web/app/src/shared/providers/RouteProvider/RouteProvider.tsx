import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from '@pages/HomePage';
import { SignUp } from '@pages/SignUp';
import { Login } from '@pages/Login';
import { useEffect } from 'react';
import { getAccount } from '@shared/api';
import { catchError, of } from 'rxjs';
import { useAppDispatch } from '@shared/hooks';
import { setUser } from '@features/common';

export const RouteProvider = () => {

  const dispath = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAccount().pipe(
      catchError(() => {
        navigate('/login');
        return of(null)
      }),
    ).subscribe((res) => {
      dispath(setUser(res))
    })
  }, []);

  return (
    <Routes>
      <Route path="/singup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
