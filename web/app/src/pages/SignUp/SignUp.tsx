import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createAccount, createEmailSession, getAccount } from '@shared/api';
import { catchError, map, of, switchMap } from 'rxjs';
import { selectUser, setUser } from '@features/common';
import { useAppDispatch, useAppSelector } from '@shared/hooks';

export const SignUp = () => {
  const user = useAppSelector(selectUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegistration = () => {
    setError(null);
    createAccount(email, password, name)
      .pipe(
        switchMap(() => {
          return createEmailSession(email, password).pipe(
            switchMap(() => {
              return getAccount().pipe(
                map((res) => {
                  if (res) {
                    dispatch(setUser(res));
                    navigate('/');
                  }
                }),
              );
            }),
            catchError((err) => {
              setError(err.message);
              return of(null);
            }),
          );
        }),
        catchError((err) => {
          setError(err.message);
          return of(null);
        }),
      )
      .subscribe();
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
        <Typography variant="h5">Регистрация</Typography>
        <TextField fullWidth required label="Имя" type="text" value={name} onChange={(e) => setName(e.target.value)} />
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
        <Button variant="contained" onClick={handleRegistration}>
          Зарегистрироваться
        </Button>
        <Button variant="outlined" onClick={handleLogin}>
          Назад
        </Button>
      </Card>
    </Box>
  );
};
