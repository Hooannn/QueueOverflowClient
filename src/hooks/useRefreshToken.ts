import { useDispatch } from 'react-redux';
import cookies from '../libs/cookies';
import { axiosIns } from './useAxiosIns';
import { signOut } from '../slices/auth.slice';
import dayjs from '../libs/dayjs';
import { toast } from '../components/ui/use-toast';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const handleError = () => {
    toast({
      title: 'Info',
      description: 'Login session expired, please login again',
    });
    dispatch(signOut());
    window.location.href = '/auth';
  };

  const refreshToken = async () =>
    new Promise<string | null>((resolve, reject) => {
      axiosIns({
        url: '/auth/refresh',
        method: 'POST',
        validateStatus: null,
        data: {
          refreshToken: cookies.get('refresh_token') || localStorage.getItem('refresh_token'),
        },
      })
        .then(res => {
          const token = res.data?.data?.credentials?.access_token;
          const refreshToken = res.data?.data?.credentials?.refresh_token;

          if (refreshToken)
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
          if (token) {
            cookies.set('access_token', token, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
            resolve(token);
          } else {
            handleError();
            resolve(null);
          }
        })
        .catch(error => {
          handleError();
          reject(error);
        });
    });

  return refreshToken;
};

export default useRefreshToken;
