import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createEmailSession, getAccount } from '@shared/api';
import { catchError, of, switchMap } from 'rxjs';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { selectUser, setUser } from '@features/common';

export const Login = () => {
  const user = useAppSelector(selectUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const handleSingUp = () => {
    navigate('/singup');
  };

  const handleLogin = () => {
    setError(null);
    createEmailSession(email, password)
      .pipe(
        catchError((err) => {
          setError(err.message);
          return of(null);
        }),
        switchMap(() => {
          return getAccount();
        }),
      )
      .subscribe((res) => {
        if (res) {
          dispatch(setUser(res));
          navigate('/');
        }
      });
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'url("./favicon/wave.jpg")',
        position: 'fixed',
        display: 'flex',
        backgroundSize: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          gap: '24px',
          width: '500px',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h5">Авторизация</Typography>
        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handleLogin}>
          Войти
        </Button>
        <Button variant="outlined" onClick={handleSingUp}>
          Регистрация
        </Button>
      </Card>
    </Box>
  );
};
