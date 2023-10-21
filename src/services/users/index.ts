import { useMutation, useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';
import { Creator, GetQuery } from '../posts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { setFollowers, setFollowing } from '../../slices/app.slice';

export interface Following {
  created_at: string;
  from_uid: string;
  to_uid: string;
  from_user: Creator;
  updated_at: string;
}

export interface Follower {
  created_at: string;
  from_uid: string;
  to_uid: string;
  to_user: Creator;
  updated_at: string;
}

const useUsers = () => {
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>();
  const dispatch = useDispatch();
  const following = useSelector((state: RootState) => state.app.following);
  const followers = useSelector((state: RootState) => state.app.followers);

  const getFollowingsQuery = useQuery({
    queryKey: ['fetch/following'],
    enabled: false,
    queryFn: () => axios.get<IResponseData<Following[]>>('/v1/users/follow/following'),
    refetchOnWindowFocus: false,
    onSuccess: data => {
      const following = data.data?.data;
      if (following) dispatch(setFollowing(following));
    },
  });

  const getFollowersQuery = useQuery({
    queryKey: ['fetch/followers'],
    enabled: false,
    queryFn: () => axios.get<IResponseData<Follower[]>>('/v1/users/follow/followers'),
    refetchOnWindowFocus: false,
    onSuccess: data => {
      const followers = data.data?.data;
      if (followers) dispatch(setFollowers(followers));
    },
  });

  const followUserMutations = useMutation({
    mutationFn: (to_uid: string) => axios.post(`/v1/users/follow/${to_uid}`),
    onError,
    onSuccess: () => {
      getFollowingsQuery.refetch();
    },
  });

  const unfollowUserMutations = useMutation({
    mutationFn: (to_uid: string) => axios.delete(`/v1/users/follow/${to_uid}`),
    onError,
    onSuccess: () => {
      getFollowingsQuery.refetch();
    },
  });

  return {
    getFollowingsQuery,
    getFollowersQuery,
    following,
    followers,
    followUserMutations,
    unfollowUserMutations,
  };
};

export default useUsers;
