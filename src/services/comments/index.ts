import { useMutation } from 'react-query';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { onError } from '../../utils/error-handlers';
import { Comment } from '../posts';
import { toast } from '../../components/ui/use-toast';
const useComments = () => {
  const axios = useAxiosIns();

  const createCommentMutation = useMutation({
    mutationFn: (params: { content: string; post_id: string; parent_id?: string }) => axios.post<IResponseData<Comment>>(`/v1/comments`, params),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Submited successfully!',
      });
    },
  });

  const upvoteCommentMutation = useMutation({
    mutationFn: ({ commentId, postId }: { commentId: string; postId: string }) =>
      axios.post<IResponseData<unknown>>(`/v1/comments/upvote/${commentId}/post/${postId}`),
    onError,
  });

  const downvoteCommentMutation = useMutation({
    mutationFn: ({ commentId, postId }: { commentId: string; postId: string }) =>
      axios.post<IResponseData<unknown>>(`/v1/comments/downvote/${commentId}/post/${postId}`),
    onError,
  });

  const removeCommentMutation = useMutation({
    mutationFn: (commentId: string) => axios.delete<IResponseData<unknown>>(`/v1/comments/${commentId}`),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Deleted successfully!',
      });
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
