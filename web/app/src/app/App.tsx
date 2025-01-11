import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { memo } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from './store/store';
import { RouteProvider, ThemeProvider } from '@shared/providers';
import CssBaseline from '@mui/material/CssBaseline';

dayjs.locale('ru');
dayjs.extend(utc);

function App() {

  return (
    <BrowserRouter future={{
      v7_startTransition: true,
    }}>
      <Provider store={store}>
        <ThemeProvider >
          <CssBaseline />
          <RouteProvider />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default memo(App);
