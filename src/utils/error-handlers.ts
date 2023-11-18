import { toast } from '../components/ui/use-toast';
import type { IResponseData } from '../types';
import type { AxiosError } from 'axios';
export const onError = (error: Error) => {
  toast({
    title: 'Error',
    description: (error as AxiosError<IResponseData<unknown>>).response?.data?.message?.toString() || error.message,
    variant: 'destructive',
  });
};
