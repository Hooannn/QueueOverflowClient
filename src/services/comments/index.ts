import { useMutation } from 'react-query';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { onError } from '../../utils/error-handlers';
import { Comment } from '../posts';
import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
const useComments = () => {
  const axios = useAxiosIns();

  const createCommentMutation = useMutation({
    mutationFn: (params: { content: string; post_id: string; parent_id?: string }) => axios.post<IResponseData<Comment>>(`/v1/comments`, params),
    onError,
    onSuccess: res => {
      toast(res.data.message ?? 'Submited successfully!', toastConfig('success'));
    },
  });

  const upvoteCommentMutation = useMutation({
    mutationFn: (commentId: string) => axios.post<IResponseData<unknown>>(`/v1/comments/upvote/${commentId}`),
    onError,
  });

  const downvoteCommentMutation = useMutation({
    mutationFn: (commentId: string) => axios.post<IResponseData<unknown>>(`/v1/comments/downvote/${commentId}`),
    onError,
  });

  const removeCommentMutation = useMutation({
    mutationFn: (commentId: string) => axios.delete<IResponseData<unknown>>(`/v1/comments/${commentId}`),
    onError,
    onSuccess: res => {
      toast(res.data.message ?? 'Deleted successfully!', toastConfig('success'));
    },
  });

  return {
    createCommentMutation,
    upvoteCommentMutation,
    downvoteCommentMutation,
    removeCommentMutation,
  };
};

export default useComments;
