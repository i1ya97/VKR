import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@pages/HomePage';
import { SignUp } from '@pages/SignUp';
import { Login } from '@pages/Login';

export const RouteProvider = () => {

  return (
    <Routes>
      <Route path="/singup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
