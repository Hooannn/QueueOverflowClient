import { useMutation, useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';
import { GetQuery, Post } from '../posts';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedPostIds } from '../../slices/app.slice';
import { RootState } from '../../@core/store';
import { toast } from '../../components/ui/use-toast';

export interface SavedPost {
  uid: string;
  created_at: string;
  updated_at: string;
  post_id: string;
  post?: Post;
}

const useSavedPosts = (enabledAutoFetch = true) => {
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    offset: 0,
    limit: 20,
  });
  const savedPostIds = useSelector((state: RootState) => state.app.savedPostIds);

  const dispatch = useDispatch();

  const getSavedPostIdsQuery = useQuery({
    queryKey: ['fetch/savedPostIds'],
    queryFn: () => axios.get<IResponseData<string[]>>(`/v1/saved_posts/id`),
    onSuccess: data => {
      const ids = data.data?.data;
      if (ids) dispatch(setSavedPostIds(ids));
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const getSavedPostsQuery = useQuery({
    queryKey: ['fetch/savedPosts', query],
    queryFn: () => axios.get<IResponseData<SavedPost[]>>(`/v1/saved_posts`),
    onSuccess: data => {},
    enabled: enabledAutoFetch,
    refetchOnWindowFocus: false,
  });

  const savedPosts = getSavedPostsQuery.data?.data.data;

  const createSavedPostMutation = useMutation({
    mutationFn: (postId: string) => axios.post<IResponseData<SavedPost>>(`/v1/saved_posts`, { post_id: postId }),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Created successfully!',
      });
    },
  });

  const removeSavedPostMutation = useMutation({
    mutationFn: (postId: string) => axios.delete<IResponseData<any>>(`/v1/saved_posts/post/${postId}`),
    onError,
    onSuccess: res => {
      toast({
        title: 'Success',
        description: res.data.message ?? 'Deleted!',
      });
    },
  });

  return { savedPosts, savedPostIds, setQuery, getSavedPostIdsQuery, createSavedPostMutation, removeSavedPostMutation };
};

export default useSavedPosts;
