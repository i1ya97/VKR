import { styled } from "@mui/material/styles";

export const SideBarRoot = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    width: '320px',
    height: '100%',
    transition: 'width 0.2s ease',
  }));