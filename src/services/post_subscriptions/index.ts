import { useMutation, useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { Post } from '../posts';
import { toast } from 'react-toastify';
import toastConfig from '../../configs/toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { savePostSubscriptions } from '../../slices/app.slice';

export interface PostSubscriptions {
  uid: string;
  created_at: string;
  updated_at: string;
  post_id: string;
  post?: Post;
}

const usePostSubscriptions = () => {
  const axios = useAxiosIns();
  const postSubscriptions = useSelector((state: RootState) => state.app.postSubscriptions);

  const dispatch = useDispatch();

  const getPostSubscriptionsQuery = useQuery({
    queryKey: ['fetch/postSubscriptions'],
    queryFn: () => axios.get<IResponseData<PostSubscriptions[]>>(`/v1/post_subscriptions`),
    onSuccess: data => {
      const subs = data.data?.data;
      if (subs) dispatch(savePostSubscriptions(subs));
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const createPostSubscriptionMutation = useMutation({
    mutationFn: (postId: string) => axios.post<IResponseData<PostSubscriptions>>(`/v1/post_subscriptions`, { post_id: postId }),
    onError,
    onSuccess: res => {
      toast(res.data.message ?? 'Created successfully!', toastConfig('success'));
    },
  });

  const removePostSubscriptionMutation = useMutation({
    mutationFn: (postId: string) => axios.delete<IResponseData<any>>(`/v1/post_subscriptions/post/${postId}`),
    onError,
    onSuccess: res => {
      toast(res.data.message ?? 'Deleted!', toastConfig('success'));
    },
  });

  return { getPostSubscriptionsQuery, createPostSubscriptionMutation, removePostSubscriptionMutation, postSubscriptions };
};

export default usePostSubscriptions;
