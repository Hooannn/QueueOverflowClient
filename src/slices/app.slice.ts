import { createSlice } from '@reduxjs/toolkit';
import { Follower, Following } from '../services/users';
import { Subscription } from '../services/subscriptions';
import { PostSubscriptions } from '../services/post_subscriptions';

export type DashboardContext = 'best' | 'hot' | 'new' | 'top';
export interface AppState {
  fcmToken?: string;
  enabledPushNotifications: boolean;
  dashboardContext: DashboardContext;
  following: Following[];
  followers: Follower[];
  savedPostIds: string[];
  subscriptions: Subscription[];
  postSubscriptions: PostSubscriptions[];
}

const initialState: AppState = {
  fcmToken: undefined,
  enabledPushNotifications: true,
  dashboardContext: 'best',
  savedPostIds: [],
  following: [],
  followers: [],
  subscriptions: [],
  postSubscriptions: [],
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
    savePostSubscriptions: (state, { payload }: { payload: PostSubscriptions[] }) => {
      state.postSubscriptions = payload;
    },
    setEnabledPushNotifications: (state, { payload }: { payload: boolean }) => {
      state.enabledPushNotifications = payload;
    },
    clearAppState: () => {
      return initialState;
    },
  },
});

export const {
  clearAppState,
  savePostSubscriptions,
  setSavedPostIds,
  setSubscriptions,
  setFcmToken,
  setDashboardContext,
  setFollowing,
  setFollowers,
  setEnabledPushNotifications,
} = appSlice.actions;

export default appSlice.reducer;
