import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../types';

export interface AuthState {
  isLogged: boolean;
  user: IUser;
}

const initialState: Partial<AuthState> = {};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: IUser }) => {
      state.user = payload;
    },
    setLogged: (state, { payload }: { payload: boolean }) => {
      state.isLogged = payload;
    },
  },
});

export const { setUser, setLogged } = authSlice.actions;

export default authSlice.reducer;
