import { ActionIn } from './ActionIn';

export interface ActionOut<T = unknown, R = unknown> extends ActionIn<T> {
  data: R;
}
