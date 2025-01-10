import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useAppDispatch } from '@shared/hooks';

export const Settings = () => {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ margin: '24px', gap: '16px' }}>
      <Typography variant="h4">Настройки профиля</Typography>
      <Divider />
      <Typography variant="h4">Личная информация</Typography>
      <Typography variant="h4">Имя</Typography>
      <Typography variant="h4">Пароль</Typography>
      <Divider />
      <Typography variant="h4">OZON аккаунт</Typography>
      <Typography variant="h4">Client ID</Typography>
      <Typography variant="h4">Client Secret</Typography>
    </Box>
  );
};
