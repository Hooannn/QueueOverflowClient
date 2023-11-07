import { useInfiniteQuery, useQuery } from 'react-query';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { Topic } from '../posts';
import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

const useTopics = (enabledAutoFetch = true) => {
  const PAGING = 20;
  const axios = useAxiosIns();
  const [searchString, setSearchString] = useState<string>('');
  const debouncedString = useDebounce(searchString, 500);
  const isSearching = searchString && searchString.trim().length > 0;

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ['search/topics', debouncedString],
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (isSearching) {
        return axios.get<IResponseData<Topic[]>>(`/v1/search/topics`, {
          params: {
            q: searchString,
          },
        });
      }
    },
  });

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading, hasNextPage } = useInfiniteQuery({
    queryKey: 'fetch/topics',
    queryFn: ({ pageParam = 0 }) => {
      return axios.get<IResponseData<Topic[]>>(`/cms/v1/topics`, {
        params: {
          offset: pageParam,
          limit: PAGING,
        },
      });
    },
    enabled: enabledAutoFetch,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    getNextPageParam: lastPage => {
      if (lastPage.config.params?.offset > (lastPage.data?.total ?? 0)) return undefined;
      const nextPageSkip = (lastPage.config.params?.offset ?? 0) + PAGING;
      return nextPageSkip;
    },
  });

  let pages = isSearching ? [searchData] : data?.pages;

  return {
    isLoading,
    pages,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    setSearchString,
    searchString,
    isSearching,
    isSearchLoading,
  };
};

export default useTopics;
