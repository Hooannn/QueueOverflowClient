import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import toastConfig from '../configs/toast';
import cookies from '../libs/cookies';
import { axiosIns } from './useAxiosIns';
import { signOut } from '../slices/auth.slice';
import dayjs from '../libs/dayjs';

const useRefreshToken = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleError = () => {
    toast(t('login session expired, please login again'), toastConfig('info'));
    dispatch(signOut());
    navigate('/auth');
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
