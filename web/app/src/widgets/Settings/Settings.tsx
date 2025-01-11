import { selectUser, setUser } from '@features/common';
import { Button, Divider, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { updateName, updatePassword } from '@shared/api';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { useState } from 'react';

export const Settings = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const [name, setName] = useState<string>(user?.name ?? '');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const isEditName = user?.name !== name;

  const isEditPassword = password && newPassword;

  const saveUserInfo = () => {
    if(isEditName) {
      updateName(name).subscribe((res) => {
        dispatch(setUser(res));
      });
    }
    if(isEditPassword) {
      updatePassword(newPassword, password).subscribe();
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
        <Button
          fullWidth
          disabled={!isEditName && !isEditPassword}
          onChange={saveUserInfo}
          variant="contained"
        >Сохранить</Button>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <Typography variant="h5">OZON аккаунт</Typography>
        <TextField size='small' label="Client ID" variant="outlined" />
        <TextField size='small' label="Client Secret" variant="outlined" />
        <Button fullWidth disabled={true} variant="contained">Сохранить</Button>
      </Box>
    </Box>
  );
};
