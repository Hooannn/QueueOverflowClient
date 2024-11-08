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
import SettingsProfilePage from '../../pages/SettingsPage/SettingsProfilePage';
import SettingsAppearancePage from '../../pages/SettingsPage/SettingsAppearancePage';
import SettingsNotificationsPage from '../../pages/SettingsPage/SettingsNotificationsPage';
import SettingsPasswordPage from '../../pages/SettingsPage/SettingsPasswordPage';
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
        children: [
          {
            path: '/settings/profile',
            element: <SettingsProfilePage />,
          },
          {
            path: '/settings/password',
            element: <SettingsPasswordPage />,
          },
          {
            path: '/settings/appearance',
            element: <SettingsAppearancePage />,
          },
          {
            path: '/settings/notifications',
            element: <SettingsNotificationsPage />,
          },
        ],
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
