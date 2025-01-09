import { Route, Routes } from 'react-router-dom';
import { Box, styled } from '@mui/material';

import { SideBar } from '@widgets/SideBar';
import { useEffect, useState } from 'react';
import { Home } from '@widgets/Home';
import { createJWT } from '@shared/api';
import Axios from 'axios-observable';
import { useAppSelector } from '@shared/hooks';
import { selectUser } from '@features/common';

const RootComponent = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
}));

export const HomePage = () => {
  const user = useAppSelector(selectUser);

  const [open, setOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      Axios.defaults.headers = {
        ...Axios.defaults.headers,
        common: {
          ...Axios.defaults.headers.common,
          Authorization: token,
        },
      };
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      createJWT().subscribe((token) => {
        setToken(token.jwt);
      });
    }
  }, [user]);

  return (
    <RootComponent>
      {token && (
        <>
          <SideBar open={open} setOpen={setOpen} />
          <Box sx={{ width: open ? 'calc(100% - 320px)' : 'calc(100% - 88px)', height: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics-ozon" element={<></>} />
              <Route path="/settings" element={<></>} />
            </Routes>
          </Box>
        </>
      )}
    </RootComponent>
  );
};
