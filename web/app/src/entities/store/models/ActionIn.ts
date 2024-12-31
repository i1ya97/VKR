import { Action } from 'redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ActionIn<T = any> extends Action<string> {
  payload: T;
}
