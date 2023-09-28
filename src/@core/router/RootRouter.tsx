import { Suspense } from 'react';
import ErrorPage from '../../pages/ErrorPage';
import RootRoute from '../../RootRoute';
import PrivateRoute from '../../components/PrivateRoute';
import WalletsPage from '../../pages/WalletsPage';
import MainLayout from '../../components/MainLayout';
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
        element: <RootRoute />,
      },
      {
        path: '/wallets',
        element: <WalletsPage />,
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
