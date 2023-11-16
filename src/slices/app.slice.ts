import { createSlice } from '@reduxjs/toolkit';
import { Follower, Following } from '../services/users';
import { Subscription } from '../services/subscriptions';

export type DashboardContext = 'best' | 'hot' | 'new' | 'top';
export interface AppState {
  fcmToken?: string;
  dashboardContext: DashboardContext;
  following: Following[];
  followers: Follower[];
  savedPostIds: string[];
  subscriptions: Subscription[];
}

const initialState: AppState = {
  fcmToken: undefined,
  dashboardContext: 'best',
  savedPostIds: [],
  following: [],
  followers: [],
  subscriptions: [],
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
    setSubscriptions: (state, { payload }: { payload: Subscription[] }) => {
      state.subscriptions = payload;
    },
    setSavedPostIds: (state, { payload }: { payload: string[] }) => {
      state.savedPostIds = payload;
    },
  },
});

export const { setSavedPostIds, setSubscriptions, setFcmToken, setDashboardContext, setFollowing, setFollowers } = appSlice.actions;

export default appSlice.reducer;
