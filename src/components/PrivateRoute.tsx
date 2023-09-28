import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../@core/store';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import cookies from '../libs/cookies';

export default function PrivateRoute(props: PropsWithChildren) {
  const location = useLocation();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  if (!isLogged) {
    cookies.set('redirect_path', location.pathname);
    return <Navigate to={'/auth'} replace />;
  }
  return props.children;
}
