import { SxProps } from '@mui/material';

export const classNames: Record<string, SxProps> = {
  root: {
    background: '#0000001F',
    padding: '8px 16px',
    gap: '16px',
    borderRadius: '4px',
    display: 'flex',
  },
  groupe: {
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '20px',
  },
  colorDot: {
    borderRadius: '8px',
    height: 12,
    width: 12,
  },
};

export const { root, groupe, row, colorDot } = classNames;
