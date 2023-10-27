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
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
