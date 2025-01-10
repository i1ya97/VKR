import { Route, Routes } from 'react-router-dom';
import { Box, styled } from '@mui/material';

import { SideBar } from '@widgets/SideBar';
import { Home } from '@widgets/Home';
import { AuthProvider } from '@shared/providers/AuthProvider';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { selectOpenSideBar, selectUser, setOpenSideBar } from '@features/common';
import { AppWriteCollection, updateDocument } from '@shared/api';
import { Settings } from '@widgets/Settings';

const RootComponent = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
}));

export const HomePage = () => {
  const dispatch = useAppDispatch();

  const openSideBar = useAppSelector(selectOpenSideBar);
  const user = useAppSelector(selectUser);

  const setOpen = (open: boolean) => {
    updateDocument(AppWriteCollection.openSideBar, openSideBar.id, {
      userId: user?.$id ?? '',
      value: open,
    }).subscribe(() => dispatch(setOpenSideBar(open)));
  };

  return (
    <AuthProvider>
      <RootComponent>
        <SideBar open={openSideBar.value} setOpen={setOpen} />
        <Box sx={{ width: openSideBar.value ? 'calc(100% - 320px)' : 'calc(100% - 88px)', height: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics-ozon" element={<></>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Box>
      </RootComponent>
    </AuthProvider>
  );
};
