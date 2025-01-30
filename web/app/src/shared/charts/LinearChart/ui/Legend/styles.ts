import { SxProps } from '@mui/material';

export const classNames: Record<string, SxProps> = {
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    opacity: 0.8,
  },
};

export const { legendItem } = classNames;
