import axios from '../../libs/axios';
import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import cookies from '../../libs/cookies';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IUser } from '../../types';
import { useNavigate } from 'react-router-dom';
interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
interface SignUpResponse {
  email: string;
  password: string;
}
export default () => {
  const navigate = useNavigate();
  const signInMutation = useMutation({
    mutationFn: (account: { email: string; password: string }) => axios.post<IResponseData<SignInResponse>>(`/auth/sign-in/email`, account),
    onError: onError,
    onSuccess: res => {
      const redirectPath = cookies.get('redirect_path') || '/';
      toast(res.data.message, toastConfig('success'));
      const { accessToken, refreshToken } = res.data.data;
      cookies.set('access_token', accessToken);
      cookies.set('refresh_token', refreshToken);
      navigate(redirectPath);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: { email: string; password: string; firstName: string; lastName: string }) =>
      axios.post<IResponseData<SignUpResponse>>('/auth/sign-up/email', data),
    onError: onError,
    onSuccess: res => {
      const { email, password } = res.data.data;
      signInMutation.mutate({ email, password });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => axios.post('/auth/forgot-password', { email }),
    onError: onError,
    onSuccess: res => {
      toast(res.data.message, toastConfig('success'));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { password: string; token: string }) => axios.post<IResponseData<SignUpResponse>>('/auth/reset-password', data),
    onError: onError,
    onSuccess: res => {
      toast(res.data.message, toastConfig('success'));
    },
  });

  return { signInMutation, forgotPasswordMutation, signUpMutation, resetPasswordMutation };
};
