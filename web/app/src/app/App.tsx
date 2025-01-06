import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { memo } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './store/store';
import { RouteProvider, ThemeProvider } from '@shared/providers';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  dayjs.locale('ru');
  dayjs.extend(utc);

  return (
    <BrowserRouter>
      <ThemeProvider >
        <CssBaseline />
        <Provider store={store}>
          <RouteProvider />
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default memo(App);
