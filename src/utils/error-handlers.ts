import { toast } from 'react-toastify';
import toastConfig from '../configs/toast';
import type { IResponseData } from '../types';
import type { AxiosError } from 'axios';
export const onError = (error: Error) => {
  toast((error as AxiosError<IResponseData<unknown>>).response?.data?.message?.toString() || error.message, toastConfig('error'));
};
