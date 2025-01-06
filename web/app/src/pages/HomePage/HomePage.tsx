import { Route, Routes, useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";


import { SideBar } from "@widgets/SideBar";
import { useState } from "react";

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
    <RootComponent>
      <SideBar open={open} setOpen={setOpen} />
      <Box sx={{ width: open ? 'calc(100% - 320px)' : 'calc(100% - 88px)', height: '100%' }}>
        <Routes>
          <Route path="/" element={<>Главная</>} />
          <Route path="/analytics-ozon" element={<>analytics-ozon</>} />
          <Route path="/settings" element={<>settings</>} />
        </Routes>
      </Box>
    </RootComponent>
  );
};
