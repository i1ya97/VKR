import { Route, Routes } from 'react-router-dom';
import { Box, styled } from '@mui/material';

import { SideBar } from '@widgets/SideBar';
import { useState } from 'react';
import { Home } from '@widgets/Home';
import { AuthProvider } from '@shared/providers/AuthProvider';

const RootComponent = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
}));

export const HomePage = () => {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <AuthProvider>
      <RootComponent>
        <SideBar open={open} setOpen={setOpen} />
        <Box sx={{ width: open ? 'calc(100% - 320px)' : 'calc(100% - 88px)', height: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics-ozon" element={<></>} />
            <Route path="/settings" element={<></>} />
          </Routes>
        </Box>
      </RootComponent>
    </AuthProvider >
  );
};
