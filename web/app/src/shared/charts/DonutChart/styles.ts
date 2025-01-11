import { SxProps } from '@mui/material';

export const classNames: Record<string, SxProps> = {
  root: {
    display: 'grid',
    alignItems: 'center',
    gap: '16px',
    justifyItems: 'center',
    height: '100%',
  },
};

export const { root } = classNames;
