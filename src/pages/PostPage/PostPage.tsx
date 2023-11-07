import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useParams } from 'react-router-dom';
import { IResponseData } from '../../types';
import { Post } from '../../services/posts';
import Loading from '../../components/Loading';
import PostCard from '../DashboardPage/PostCard';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';

export default function PostPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const axios = useAxiosIns();
  const params = useParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fetch/post', params.id],
    refetchOnWindowFocus: false,
    queryFn: () => axios.get<IResponseData<Post>>(`/v1/posts/${params.id}`),
  });

  const post = data?.data?.data as Post;
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    if (!socket && post?.id) {
      const newSocket = io(`${import.meta.env.VITE_SOCKET_ENDPOINT}posts`);

      newSocket.on('connect', () => {
        newSocket.emit('subscribe', post.id);
      });

      newSocket.on('comment:create', (data: { postId: string; creatorId: string }) => {
        if (user?.id !== data?.creatorId) refetch();
      });

      setSocket(newSocket);
    }

    return () => {
      socket?.disconnect();
      socket?.close();
    };
  }, [post, socket]);
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div>
          <PostCard
            isPreview={false}
            refetchPostAt={(postId: string) => {
              if (postId === post.id) refetch();
            }}
            post={post}
          />
        </div>
      )}
    </>
  );
}
