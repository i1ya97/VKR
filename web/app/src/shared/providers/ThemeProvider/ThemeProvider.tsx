import { PropsWithChildren } from 'react';
import { createTheme, ThemeProvider as ThemeProviderMUI } from '@mui/material/styles';
import { useAppSelector } from '@shared/hooks';
import { selectTheme } from '@features/common';

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#161616',
      paper: '#1c1c1c'
    },
  },
});
const themeLight = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#fafafa'
    },
  },
});

export const ThemeProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const theme = useAppSelector(selectTheme);

  const darkMode = theme === 'dark';

  return (
    <ThemeProviderMUI theme={darkMode ? themeDark : themeLight}>
      {children}
    </ThemeProviderMUI>
  );
};
