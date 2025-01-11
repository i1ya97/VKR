import { fetchApiCredentions, selectOzonApiCredentions, selectUser, setOzonApiCredentions, setUser } from '@features/common';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AppWriteCollection, updateDocument, updateName, updatePassword } from '@shared/api';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { catchError, of } from 'rxjs';

export const Settings = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const ozonApiCredentions = useAppSelector(selectOzonApiCredentions);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [client, setClient] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    dispatch(fetchApiCredentions());
  }, [])

  useEffect(() => {
    setClient(ozonApiCredentions?.client ?? '');
    setToken(ozonApiCredentions?.token ?? '');
  }, [ozonApiCredentions])

  const isEditName = user?.name !== name;

  const isEditPassword = password && newPassword;

  const isEditClient = client && token
    && ((ozonApiCredentions?.token ?? '') !== token || (ozonApiCredentions?.client ?? '') !== client);

  const saveUserInfo = () => {
    if (isEditName) {
      updateName(name).subscribe((res) => {
        dispatch(setUser(res));
      });
    }
    if (isEditPassword) {
      updatePassword(newPassword, password).pipe(
        catchError((err) => {
          setErrorPassword(err.message);
          return of(null);
        })
      ).subscribe((res) => {
        if (res) {
          setErrorPassword('');
          setPassword('');
          setNewPassword('')
          dispatch(setUser(res));
        }
      });
    }
  }

  const saveClientAndToken = () => {
    if (isEditClient) {
      updateDocument(AppWriteCollection.apiCredentions, ozonApiCredentions?.id ?? '', {
        userId: user?.$id ?? '',
        target: 'OZON',
        client: client,
        token: token,
      }).subscribe((res) => dispatch(setOzonApiCredentions({
        id: res.$id, client: res.client, token: res.token
      })));
    }
  }

  return (
    <Box sx={{ margin: '24px', gap: '16px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4">Настройки профиля</Typography>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <Typography variant="h5">Личная информация</Typography>
        <Typography variant="h6">Изменить имя</Typography>
        <TextField
          size='small'
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Новое имя"
          variant="outlined"
        />
        <Typography variant="h6">Изменить пароль</Typography>
        <Box sx={{ gap: '8px', display: 'flex' }}>
          <TextField
            fullWidth
            size='small'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Старый пароль"
            variant="outlined"
            type='password'
          />
          <TextField
            fullWidth
            size='small'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="Новый пароль"
            variant="outlined"
            type='password'
          />
        </Box>
        {errorPassword && <Typography>{errorPassword}</Typography>}
        <Button
          fullWidth
          disabled={!isEditName && !isEditPassword}
          onClick={saveUserInfo}
          variant="contained"
        >Сохранить</Button>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <Typography variant="h5">OZON аккаунт</Typography>
        <TextField
          size='small'
          label="Client ID"
          variant="outlined"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <TextField
          size='small'
          label="Client Secret"
          variant="outlined"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <Button
          fullWidth
          onClick={saveClientAndToken}
          disabled={!isEditClient}
          variant="contained"
        >Сохранить</Button>
      </Box>
    </Box>
  );
};
