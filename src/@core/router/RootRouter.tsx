import { Suspense } from 'react';
import ErrorPage from '../../pages/ErrorPage';
import RootRoute from '../../RootRoute';
const rootRouter = [
  {
    path: '/',
    element: (
      <Suspense>
        <RootRoute />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
];

export default rootRouter;
