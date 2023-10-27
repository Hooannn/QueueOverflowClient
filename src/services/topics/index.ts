import { useQuery } from 'react-query';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';
import { GetQuery, Topic } from '../posts';

const useTopics = (enabledAutoFetch = true) => {
  const axios = useAxiosIns();

  const [query, setQuery] = useState<GetQuery>({
    skip: 0,
    limit: 20,
  });

  const getTopicsQuery = useQuery({
    queryKey: ['fetch/topics', query],
    queryFn: () =>
      axios.get<IResponseData<Topic[]>>('/cms/v1/topics', {
        params: query,
      }),
    refetchOnWindowFocus: false,
    enabled: enabledAutoFetch,
  });
  let topics = getTopicsQuery.data?.data?.data;

  return {
    getTopicsQuery,
    topics,
  };
};

export default useTopics;
