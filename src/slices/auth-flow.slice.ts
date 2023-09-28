import { createSlice } from '@reduxjs/toolkit';

export enum AuthFlowType {
  SignIn = 'signin',
  SignUp = 'signup',
}

export interface AuthFlowState {
  type?: AuthFlowType;
  email?: string;
  passcode?: string;
}

const initialState: Partial<AuthFlowState> = {
  type: undefined,
  email: '',
  passcode: '',
};

export const authFlowSlice = createSlice({
  name: 'auth-flow',
  initialState,
  reducers: {
    setEmail: (state, { payload }: { payload: string }) => {
      state.email = payload;
    },
    setPasscode: (state, { payload }: { payload: string }) => {
      state.passcode = payload;
    },
    setAuthType: (state, { payload }: { payload: AuthFlowType | undefined }) => {
      state.type = payload;
    },
  },
});

export const { setEmail, setAuthType, setPasscode } = authFlowSlice.actions;

export default authFlowSlice.reducer;
