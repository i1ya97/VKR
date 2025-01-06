import { PropsWithChildren } from 'react';
import { createTheme, ThemeProvider as ThemeProviderMUI  } from '@mui/material/styles';

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

  const dark = true;


  return (
    <ThemeProviderMUI theme={dark ? themeDark : themeLight}>
      {children}
    </ThemeProviderMUI>
  );
};
