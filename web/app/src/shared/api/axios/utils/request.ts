import Axios from 'axios-observable';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

import { ApiMethods } from '../constants/ApiMethods';

export const request = <T = unknown>(method: ApiMethods, baseURL: string, url: string, data?: object) => {
  const instance = Axios.create({ baseURL, method });
  const request$ = instance.request<T>({ url, data });

  return firstValueFrom(request$, { defaultValue: undefined });
};
