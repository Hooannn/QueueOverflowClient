import { createSlice } from '@reduxjs/toolkit';
import { Creator } from '../services/posts';
import { Follower, Following } from '../services/users';

export type DashboardContext = 'best' | 'hot' | 'new' | 'top';
export interface AppState {
  fcmToken?: string;
  dashboardContext: DashboardContext;
  following: Following[];
  followers: Follower[];
}

const initialState: AppState = {
  fcmToken: undefined,
  dashboardContext: 'best',
  following: [],
  followers: [],
};
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFcmToken: (state, { payload }: { payload: string }) => {
      state.fcmToken = payload;
    },
    setDashboardContext: (state, { payload }: { payload: DashboardContext }) => {
      state.dashboardContext = payload;
    },
    setFollowing: (state, { payload }: { payload: Following[] }) => {
      state.following = payload;
    },
    setFollowers: (state, { payload }: { payload: Follower[] }) => {
      state.followers = payload;
    },
  },
});

export const { setFcmToken, setDashboardContext, setFollowing, setFollowers } = appSlice.actions;

export default appSlice.reducer;
