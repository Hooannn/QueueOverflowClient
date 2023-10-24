import { useMutation, useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useEffect, useState } from 'react';
import { GetQuery } from '../posts';

const useNotifications = () => {
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    skip: 0,
    limit: 20,
    relations: ['creator'],
  });

  const registerFcmTokenMutation = useMutation({
    mutationFn: (token: string) => axios.post<IResponseData<any>>('/v1/notifications/fcm/token', { web: token }),
    onError: onError,
  });

  const getNotificationsQuery = useQuery({
    queryKey: ['fetch/notifications', query],
    queryFn: () => axios.get<IResponseData<Notification[]>>(`/v1/notifications`, { params: query }),
    onSuccess: data => {},
    refetchOnWindowFocus: false,
  });

  const getUnreadNotificationsCountQuery = useQuery({
    queryKey: ['fetch/notifications/unread/count'],
    queryFn: () => axios.get<IResponseData<number>>(`/v1/notifications/unread/count`),
    onSuccess: data => {},
    refetchOnWindowFocus: false,
  });

  const notifications = getNotificationsQuery.data?.data?.data;
  const unreadNotificationsCount = getUnreadNotificationsCountQuery.data?.data?.data;

  return {
    registerFcmTokenMutation,
    getNotificationsQuery,
    notifications,
    unreadNotificationsCount,
    getUnreadNotificationsCountQuery,
  };
};

export default useNotifications;
