import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import cookies from '../../libs/cookies';

import { onError } from '../../utils/error-handlers';
import { IResponseData, IUser } from '../../types';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../@core/store';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from '../../libs/dayjs';
import { useState } from 'react';
import useAxiosIns from '../../hooks/useAxiosIns';
const usePlaid = () => {
  const axios = useAxiosIns();
  const getLinkToken = useMutation({
    mutationFn: () => {
      return axios.post<IResponseData<any>>(`/plaid/create_link_token`);
    },
    onSuccess: data => {},
    onError,
  });

  const exchangePublicToken = useMutation({
    mutationFn: (params: { publicToken: string; accounts: any[] }) => {
      return axios.post<IResponseData<any>>(`/plaid/set_access_token`, {
        public_token: params.publicToken,
        accounts: params.accounts,
      });
    },
    onSuccess: data => {},
    onError,
  });

  return {
    getLinkToken,
    exchangePublicToken,
  };
};

export default usePlaid;
