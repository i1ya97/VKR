import { map } from 'rxjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectTheme, selectUser, setTheme, setUser } from '@features/common';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { AppWriteCollection, deleteSession, updateDocument } from '@shared/api';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { SideBarRoot } from './ui/SideBarRoot';
import { Profile } from './ui/Profile';
import { sideBarItems } from './constants';
interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SideBar = (props: Props) => {
  const { open, setOpen } = props;

  const location = useLocation();

  const theme = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);

  const darkMode = theme.value === 'dark';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const hasSelected = (path: string) => {
    return location.pathname.replaceAll('/', '') === path.replaceAll('/', '');
  };

  const handleExit = () => {
    deleteSession()
      .pipe(
        map(() => {
          dispatch(setUser(null));
          navigate('/login');
        }),
      )
      .subscribe();
  };

  const handleOpenRoute = (path: string) => {
    navigate(path);
  };

  const handleResize = () => {
    setOpen(!open);
  };

  const handleChangeTheme = () => {
    const value = !!darkMode ? 'light' : 'dark';
    updateDocument(AppWriteCollection.activeTheme, theme.id, {
      userId: user?.$id ?? '',
      value: value,
    }).subscribe(() => dispatch(setTheme(value)));
  };

  return (
    <SideBarRoot sx={{ width: open ? '320px' : '88px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
          <Profile>
            <Avatar sx={{ width: 48, height: 48 }}>{user?.name[0]}</Avatar>
            {open && <Typography>{user?.name}</Typography>}
            {open && (
              <IconButton onClick={handleChangeTheme}>{darkMode ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
            )}
          </Profile>
          <Box sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            {sideBarItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => handleOpenRoute(item.path)}
                sx={{ borderRadius: '8px', height: '44px' }}
                selected={hasSelected(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText secondary={item.name} />}
              </ListItemButton>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <ListItemButton
            onClick={() => handleOpenRoute('/settings')}
            sx={{ borderRadius: '8px', height: '44px' }}
            selected={hasSelected('/settings')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText secondary="Настройки" />}
          </ListItemButton>
          <ListItemButton onClick={handleExit} sx={{ borderRadius: '8px', height: '44px' }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText secondary="Выйти" />}
          </ListItemButton>
          <ListItemButton onClick={handleResize} sx={{ borderRadius: '8px', height: '44px' }}>
            <ListItemIcon>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</ListItemIcon>
            {open && <ListItemText secondary="Свернуть" />}
          </ListItemButton>
        </Box>
      </Box>
    </SideBarRoot>
  );
};
