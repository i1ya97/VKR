import { styled } from "@mui/material/styles";

export const BorderBox = styled('div')(({ theme }) => ({
    display: 'flex',
    height: '40px',
    width: '100%',
    border: '1px dashed ' + theme.palette.primary.main,
    borderRadius: '8px',
    justifyContent: 'center',
    alignItems: 'center'
}));