import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import authReducer from '../slices/auth.slice';
import appReducer from '../slices/app.slice';
import authFlowReducer from '../slices/auth-flow.slice';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
export const store = configureStore({
  reducer: {
    //@ts-ignore
    auth: persistReducer(
      {
        key: 'auth',
        version: 1,
        storage,
      },
      authReducer,
    ),
    //@ts-ignore
    app: persistReducer(
      {
        key: 'app',
        version: 1,
        storage,
      },
      appReducer,
    ),
    authFlow: authFlowReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
