import { LinePathsItem } from './LinePathsItem';

export interface ILinePath {
  key: string;
  dotsType?: 'only' | 'hide' | 'display';
  isDefined?: boolean;
  data: LinePathsItem[];
}
