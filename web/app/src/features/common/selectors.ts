const commonDataModule = (state: RootState) => state.commonData;

export const selectTestObject = (state: RootState) => commonDataModule(state).testObject;
