import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import { memo } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MainPage } from '@pages/MainPage';
import { NotFound } from '@pages/NotFound';
import { RedirectMainPage } from '@pages/RedirectMainPage';
import { AuthProvider } from '@shared/providers';

import { store } from './store/store';

function App() {
  dayjs.locale('ru');
  dayjs.extend(utc);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store}>
          <Routes>
            <Route path="/:boreId">
              <Route index element={<RedirectMainPage />} />
              <Route path="/:boreId/:tab" element={<MainPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default memo(App);
