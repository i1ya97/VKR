import { styled } from "@mui/material/styles";

export const SideBarRootComponent = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    width: '320px',
    height: '100%',
    transition: 'width 0.5s ease',
  }));