import axios from '../../libs/axios';
import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import cookies from '../../libs/cookies';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IUser } from '../../types';
import { useNavigate } from 'react-router-dom';
export default () => {
  const navigate = useNavigate();

  const checkUser = useMutation({
    mutationFn: (email: string) => {
      const base64 = btoa(email);
      return axios.get<IResponseData<any>>(`/auth?email=${base64}`);
    },
    onError: (err: any) => {
      if (err.status?.code === 403) {
      } else {
        onError(err);
      }
    },
    onSuccess: res => {},
  });

  return { checkUser };
};
