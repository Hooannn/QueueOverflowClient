import { createSlice } from '@reduxjs/toolkit';

export interface AppState {
  fcmToken?: string;
}

const initialState: Partial<AppState> = {
  fcmToken: undefined,
};
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFcmToken: (state, { payload }: { payload: string }) => {
      state.fcmToken = payload;
    },
  },
});

export const { setFcmToken } = appSlice.actions;

export default appSlice.reducer;
