const commonModule = (state: RootState) => state.common;

export const selectUser = (state: RootState) => commonModule(state).user;
