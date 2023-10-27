import { useMutation, useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData } from '../../types';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useEffect, useState } from 'react';
import { Creator, GetQuery } from '../posts';
import { useSocket } from '../../contexts/SocketContext';

export interface Notification {
  content: string;
  created_at: string;
  created_by: string;
  creator?: Creator;
  id: string;
  idx: number;
  meta_data?: any | null;
  read: boolean;
  recipient_id: string;
  title: string;
  updated_at: string;
}

const useNotifications = () => {
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    skip: 0,
    limit: 5,
    relations: ['creator'],
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

  const markAllNotificationsMutation = useMutation({
    mutationFn: () => axios.patch<IResponseData<unknown>>(`/v1/notifications/mark-all`),
    onError,
    onSuccess: () => {
      refresh();
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: () => axios.delete<IResponseData<unknown>>(`/v1/notifications`),
    onError,
    onSuccess: () => {
      refresh();
    },
  });

  const markAllNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => axios.patch<IResponseData<unknown>>(`/v1/notifications/mark/${notificationId}`),
    onError,
    onSuccess: () => {
      refresh();
    },
  });

  const refresh = async () => Promise.all([getNotificationsQuery.refetch(), getUnreadNotificationsCountQuery.refetch()]);

  const notifications = getNotificationsQuery.data?.data?.data;
  const unreadNotificationsCount = getUnreadNotificationsCountQuery.data?.data?.data;

  const { socket } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on('new-notification', () => {
        refresh();
      });
    }

    return () => {
      socket?.removeListener('new-notification');
    };
  }, [socket]);

  return {
    getNotificationsQuery,
    notifications,
    unreadNotificationsCount,
    getUnreadNotificationsCountQuery,
    refresh,
    markAllNotificationsMutation,
    markAllNotificationMutation,
    deleteAllNotificationsMutation,
  };
};

export default useNotifications;
