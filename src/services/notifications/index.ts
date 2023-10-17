import { useMutation } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';

const useNotifications = () => {
  const axios = useAxiosIns();
  const registerFcmTokenMutation = useMutation({
    mutationFn: (token: string) => axios.post<IResponseData<any>>('/v1/notifications/fcm/token', { web: token }),
    onError: onError,
  });

  return {
    registerFcmTokenMutation,
  };
};

export default useNotifications;
