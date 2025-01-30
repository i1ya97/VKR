import { styled } from "@mui/material";

export const LegendContainer = styled('div')(({ }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const Scroll = styled('div')(({ }) => ({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    height: 8,
    width: 8,
    borderRadius: '9em',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    borderRadius: '9em',
  },
}));

export const ScrollContainer = styled('div')(({ }) => ({
  padding: '4px 0'
}));

export const Container = styled('div')(({ }) => ({
  display: 'flex',
  flexDirection: 'column',
}));