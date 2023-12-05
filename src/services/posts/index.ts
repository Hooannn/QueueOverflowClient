import { useMutation, useQuery, useQueryClient } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';
import { toast } from '../../components/ui/use-toast';
export enum VoteType {
  Up,
  Down,
}

export enum PostType {
  Post = 'post',
  Media = 'media',
  Poll = 'poll',
}

export interface Topic {
  id: string;
  description: string | null;
  title: string;

  created_at?: string;
  updated_at?: string;
  posts_count?: number;
  subscriptions_count?: number;
}
export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  created_at: string;
}

export interface Vote {
  type: VoteType;
  uid: string;
}

export interface Comment {
  id: string;
  idx: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  content: string;
  is_root: boolean;
  parent_id: string | null;
  meta_data?: any;
  post_id: string;
  creator?: Creator;
  post?: Post;
  votes?: Vote[];
}

export interface Post {
  id: string;
  idx: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  title: string;
  content: string;
  tags: string[];
  publish: boolean;
  meta_data?: any;
  votes: Vote[];
  comments: Comment[];
  creator: Creator;
  topics: Topic[];
  type: PostType;
}

export interface GetQuery {
  offset?: number;
  limit?: number;
  relations?: string[];
}

export interface GetPostQuery extends GetQuery {
  topicIds?: string[];
}

const usePosts = (enabledAutoFetch = true) => {
  const axios = useAxiosIns();

  const [query, setQuery] = useState<GetPostQuery>({
    offset: 0,
    limit: 20,
    relations: ['votes', 'comments', 'creator', 'topics'],
    topicIds: [],
  });

  const getPostsQuery = useQuery({
    queryKey: ['fetch/posts', query],
    queryFn: () =>
      axios.get<IResponseData<Post[]>>('/v1/posts', {
        params: query,
      }),
    refetchOnWindowFocus: false,
    enabled: enabledAutoFetch,
  });
  let posts = getPostsQuery.data?.data?.data;

  const getPostMutation = useMutation({
    mutationFn: (postId: string) => axios.get<IResponseData<Post>>(`/v1/posts/${postId}`),
  });

  const upvoteMutation = useMutation({
    mutationFn: (postId: string) => axios.post(`/v1/posts/upvote/${postId}`),
    onError,
  });

  const downvoteMutation = useMutation({
    mutationFn: (postId: string) => axios.post(`/v1/posts/downvote/${postId}`),
    onError,
  });

  const createPostMutation = useMutation({
    mutationFn: (params: { title: string; type: PostType; content: string; topics?: { id: string }[] }) =>
      axios.post<IResponseData<Post>>(`/v1/posts`, params),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Created successfully!',
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (params: { postId?: string; title: string; type: PostType; content: string; topics?: { id: string }[] }) => {
      const endpoint = `/v1/posts/${params.postId}`;
      delete params.postId;
      return axios.patch<IResponseData<Post>>(endpoint, params);
    },
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Updated successfully!',
      });
    },
  });

  const queryClient = useQueryClient();
  const removePostMutation = useMutation({
    mutationFn: (postId: string) => axios.delete<IResponseData<any>>(`/v1/posts/${postId}`),
    onError,
    onSuccess: res => {
      queryClient.invalidateQueries('fetch/posts');
      toast({
        title: 'Success',
        description: res.data.message ?? 'Created successfully!',
      });
    },
  });

  return {
    getPostsQuery,
    setQuery,
    upvoteMutation,
    downvoteMutation,
    getPostMutation,
    createPostMutation,
    posts,
    removePostMutation,
    updatePostMutation,
  };
};

export default usePosts;
