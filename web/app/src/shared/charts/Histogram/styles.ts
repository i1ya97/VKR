import { SxProps } from '@mui/material';

export const classNames: Record<string, SxProps> = {
  root: {
    height: '100%',
    gap: '8px',
    display: 'grid',
    justifyItems: 'center',
    gridTemplateRows: 'auto max-content',
  },
};

export const { root } = classNames;
