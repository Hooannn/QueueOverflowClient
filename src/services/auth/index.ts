import { useMutation } from 'react-query';
import cookies from '../../libs/cookies';

import { AuthFlowType, setAuthType, setEmail, setPasscode } from '../../slices/auth-flow.slice';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IUser } from '../../types';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../@core/store';
import { useDispatch, useSelector } from 'react-redux';
import { setLogged, setUser } from '../../slices/auth.slice';
import dayjs from '../../libs/dayjs';
import { useState } from 'react';
import useAxiosIns from '../../hooks/useAxiosIns';
import { toast } from '../../components/ui/use-toast';
const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axios = useAxiosIns();
  const email = useSelector((state: RootState) => state.authFlow.email);
  const passcode = useSelector((state: RootState) => state.authFlow.passcode);
  const authType = useSelector((state: RootState) => state.authFlow.type);

  const updateAuthType = (type?: AuthFlowType) => {
    dispatch(setAuthType(type));
  };

  const updateEmail = (email: string) => {
    dispatch(setEmail(email));
  };

  const updatePasscode = (passcode: string) => {
    dispatch(setPasscode(passcode));
  };

  const [shouldShowPasscodeModal, setShowPasscodeModal] = useState(false);

  const clearInput = () => {
    updateEmail('');
    updateAuthType(undefined);
    updatePasscode('');
  };

  const renewPasscode = useMutation({
    mutationFn: () => {
      const base64 = btoa(email ?? '');
      return axios.get<IResponseData<any>>(`/auth?email=${base64}`);
    },
    onError,
    onSuccess: () => {},
  });

  const checkUser = useMutation({
    mutationFn: () => {
      const base64 = btoa(email ?? '');
      return axios.get<IResponseData<any>>(`/auth?email=${base64}`);
    },
    onError: (err: any) => {
      if (err.response?.status === 403) {
        createPassword.mutate();
      } else {
        onError(err);
      }
    },
    onSuccess: () => {
      updateAuthType(AuthFlowType.SignIn);
      if (!shouldShowPasscodeModal) setShowPasscodeModal(true);
    },
  });

  const createPassword = useMutation({
    mutationFn: () => {
      return axios.post<IResponseData<any>>(`/auth/sign-up/password`, {
        email,
      });
    },
    onSuccess: data => {
      toast({
        title: 'Success',
        description: data.data.message ?? 'Passcode created and sent to the email!',
      });
      updateAuthType(AuthFlowType.SignUp);
      if (!shouldShowPasscodeModal) setShowPasscodeModal(true);
    },
    onError,
  });

  const renewPassword = useMutation({
    mutationFn: () => {
      return axios.post<IResponseData<any>>(`/auth/sign-up/password`, {
        email,
      });
    },
    onSuccess: data => {
      toast({
        title: 'Success',
        description: data.data.message ?? 'Passcode created and sent to the email!',
      });
      if (!shouldShowPasscodeModal) setShowPasscodeModal(true);
    },
    onError,
  });

  const saveCredentialsAndRedirect = (user: IUser, accessToken: string, refreshToken: string) => {
    const redirectPath = cookies.get('redirect_path') || '/';
    cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
    cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) });
    dispatch(setLogged(true));
    dispatch(setUser(user));
    clearInput();
    navigate(redirectPath as string);
  };

  const signInMutation = useMutation({
    mutationFn: (isRenewPassword: boolean) => {
      const endpoint = isRenewPassword ? `/auth/sign-in/renew-password` : `/auth/sign-in`;
      return axios.post<IResponseData<any>>(endpoint, {
        email,
        password: passcode,
      });
    },

    onError: onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message,
      });
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: () =>
      axios.post<IResponseData<any>>('/auth/sign-up', {
        email,
        password: passcode,
      }),
    onError: onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message,
      });
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  const signInWithGithubMutation = useMutation({
    mutationFn: (code: string) => axios.post<IResponseData<any>>('/auth/github', { code }),
    onError: onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message,
      });
      const data = res.data?.data;
      const user = data?.user;
      const accessToken = data?.credentials?.access_token;
      const refreshToken = data?.credentials?.refresh_token;
      saveCredentialsAndRedirect(user, accessToken, refreshToken);
    },
  });

  return {
    checkUser,
    signInMutation,
    signUpMutation,
    shouldShowPasscodeModal,
    email,
    passcode,
    updateEmail,
    updatePasscode,
    authType,
    setShowPasscodeModal,
    renewPassword,
    signInWithGithubMutation,
  };
};

export default useAuth;
