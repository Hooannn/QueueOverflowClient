//@ts-nocheck
import { Suspense } from 'react';
import ErrorPage from '../../pages/ErrorPage';
import PrivateRoute from '../../components/PrivateRoute';
import MainLayout from '../../components/MainLayout';
import DashboardPage from '../../pages/DashboardPage';
import NotificationsPage from '../../pages/NotificationsPage';
import ExplorePage from '../../pages/ExplorePage';
import SettingsPage from '../../pages/SettingsPage';
import SubmitPage from '../../pages/SubmitPage';
import PostPage from '../../pages/PostPage';
import ProfilePage from '../../pages/ProfilePage';
const rootRouter = [
  {
    path: '/',
    element: (
      <Suspense>
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/post/:id',
        element: <PostPage />,
      },
      {
        path: '/submit',
        element: <SubmitPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/explore',
        element: <ExplorePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/profile/:id',
        element: <ProfilePage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
