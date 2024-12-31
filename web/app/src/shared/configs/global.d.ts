export {};

declare global {
  declare type RootState = import('../../app/store/store').RootState;
  declare type AppDispatch = import('../../app/store/store').AppDispatch;
  let ASSET_PATH: string;
  interface Window {
    _env_: {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose | any;
  }
}
