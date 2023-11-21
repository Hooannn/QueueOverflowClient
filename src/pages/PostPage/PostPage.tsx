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
import SharedDialog from '../DashboardPage/SharedDialog';

export default function PostPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const axios = useAxiosIns();
  const params = useParams();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fetch/post', params.id],
    refetchOnWindowFocus: false,
    queryFn: () => axios.get<IResponseData<Post>>(`/v1/posts/${params.id}`),
    onSuccess: res => {
      if (!socket) {
        const newSocket = io(`${import.meta.env.VITE_SOCKET_ENDPOINT}posts`);

        newSocket.on('connect', () => {
          newSocket.emit('subscribe', res.data.data.id);
        });

        newSocket.on('comment:created', (data: { postId: string; creatorId: string }) => {
          if (user?.id !== data?.creatorId) refetch();
        });

        newSocket.on('comment:removed', (data: { postId: string; creatorId: string }) => {
          if (user?.id !== data?.creatorId) refetch();
        });

        newSocket.on('comment:updated', (data: { postId: string; creatorId: string }) => {
          if (user?.id !== data?.creatorId) refetch();
        });

        setSocket(newSocket);
      }
    },
  });

  const post = data?.data?.data as Post;
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    return () => {
      socket?.disconnect();
      socket?.close();
    };
  }, [socket]);

  const [shouldShowSharedDialog, setShowSharedDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  const showShareDialog = (postId: string, postTitle: string) => {
    setShowSharedDialog(true);
    setShareUrl(`${window.location.origin}/post/${postId}`);
    setShareTitle(postTitle);
  };
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div>
          <SharedDialog shareUrl={shareUrl} title={shareTitle} onOpenChange={val => setShowSharedDialog(val)} isOpen={shouldShowSharedDialog} />
          <PostCard
            isPreview={false}
            refetchPostAt={(postId: string) => {
              if (postId === post.id) refetch();
            }}
            post={post}
            showSharedDialog={(postId, postTitle) => {
              showShareDialog(postId, postTitle);
            }}
          />
        </div>
      )}
    </>
  );
}
