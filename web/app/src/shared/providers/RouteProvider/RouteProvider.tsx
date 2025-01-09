import { Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from '@pages/HomePage';
import { SignUp } from '@pages/SignUp';
import { Login } from '@pages/Login';
import { AuthProvider } from '../AuthProvider/AuthProvider';

export const RouteProvider = () => {

  return (
    <Routes>
      <Route path="/singup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};
