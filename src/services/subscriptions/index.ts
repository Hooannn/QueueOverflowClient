import { useMutation, useQuery } from 'react-query';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscriptions } from '../../slices/app.slice';
import { RootState } from '../../@core/store';
import { Topic } from '../posts';
import { onError } from '../../utils/error-handlers';

export interface Subscription {
  uid: string;
  topic_id: string;
  topic?: Topic;
  created_at: string;
  updated_at: string;
}

const useSubscriptions = () => {
  const axios = useAxiosIns();
  const dispatch = useDispatch();
  const subscriptions = useSelector((state: RootState) => state.app.subscriptions);

  const getSubscriptionsQuery = useQuery({
    queryKey: ['fetch/subscriptions'],
    queryFn: () => axios.get<IResponseData<Subscription[]>>('/v1/subscriptions'),
    refetchOnWindowFocus: false,
    enabled: false,
    onSuccess: data => {
      const subscriptions = data.data?.data;
      if (subscriptions) dispatch(setSubscriptions(subscriptions));
    },
  });

  const createSubscriptionsMutation = useMutation({
    mutationFn: (topicId: string) => axios.post<IResponseData<Subscription>>(`/v1/subscriptions/topic/${topicId}`),
    onSuccess: () => {
      getSubscriptionsQuery.refetch();
    },
    onError,
  });

  const removeSubscriptionsMutation = useMutation({
    mutationFn: (topicId: string) => axios.delete<IResponseData<any>>(`/v1/subscriptions/topic/${topicId}`),
    onSuccess: () => {
      getSubscriptionsQuery.refetch();
    },
    onError,
  });

  return {
    getSubscriptionsQuery,
    subscriptions,
    createSubscriptionsMutation,
    removeSubscriptionsMutation,
  };
};

export default useSubscriptions;
