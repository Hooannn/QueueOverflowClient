import { useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';

export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  created_at: string;
}

export interface Vote {
  type: number;
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
}

export interface GetQuery {
  skip?: number;
  limit?: number;
  relations?: string[];
}

const usePosts = () => {
  const axios = useAxiosIns();

  const [query, setQuery] = useState<GetQuery>({
    skip: 0,
    limit: 20,
    relations: ['votes', 'comments', 'creator'],
  });

  const getPostsQuery = useQuery({
    queryKey: ['fetch/posts', query],
    queryFn: () =>
      axios.get<IResponseData<Post[]>>('/v1/posts', {
        params: query,
      }),
    refetchOnWindowFocus: false,
  });

  return {
    getPostsQuery,
    setQuery,
  };
};

export default usePosts;
