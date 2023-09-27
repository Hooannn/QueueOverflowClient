import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types";

export interface AuthState {
  isLogged: boolean;
  user: User;
}

const initialState: Partial<AuthState> = {};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    setLogged: (state, { payload }: { payload: boolean }) => {
      state.isLogged = payload;
    },
  },
});

export const { setUser, setLogged } = authSlice.actions;

export default authSlice.reducer;
