import { SxProps } from '@mui/material';

export const classNames: Record<string, SxProps> = {
  root: {
    display: 'flex',
    padding: '8px 12px',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '16px',
  },
};

export const { root, row } = classNames;
