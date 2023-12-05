import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IResponseData } from '../../types';
import { Post, VoteType } from '../../services/posts';
import Loading from '../../components/Loading';
import PostCard from '../DashboardPage/PostCard';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import SharedDialog from '../DashboardPage/SharedDialog';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { InfoIcon, Terminal } from 'lucide-react';

export default function PostPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const axios = useAxiosIns();
  const params = useParams();

  const getRelatedPostsQuery = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['fetch/relatedPosts', params.id],
    queryFn: () => axios.get<IResponseData<Post[]>>(`/v1/posts/${params.id}/related`),
    onSuccess: res => {},
  });

  const relatedPosts = getRelatedPostsQuery.data?.data.data.sort((a, b) => (b as any).score - (a as any).score);

  const votePoints = (post: Post) =>
    post.votes?.reduce((prev, current) => {
      if (current.type === VoteType.Up) prev++;
      else prev--;
      return prev;
    }, 0);

  const [searchParams] = useSearchParams();
  const isPublished = searchParams.get('publish');

  const endpoint = isPublished === 'true' ? `/v1/posts/${params.id}/published` : `/v1/posts/${params.id}/reviewing`;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fetch/post', params.id],
    refetchOnWindowFocus: false,
    queryFn: () => axios.get<IResponseData<Post>>(endpoint),
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
  const navigate = useNavigate();
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
        <div className="flex flex-col gap-4">
          {!post.publish && (
            <Alert variant={'destructive'}>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>This post is under reviewing!</AlertTitle>
              <AlertDescription>You can update your post and resubmit again.</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-4">
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
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">Related</h3>
              <div className="mt-2"></div>
              {getRelatedPostsQuery.isLoading ? (
                <div className="flex flex-col gap-2 w-[250px]">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={`Skeleton::${i}`} className="w-full h-10 rounded" />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {relatedPosts && relatedPosts!.length > 0 ? (
                    <>
                      {relatedPosts?.map(relatedPost => (
                        <div key={relatedPost.id} className="flex items-center gap-2">
                          <div className="text-xs font-bold px-3 py-1 bg-emerald-50 rounded-lg text-black">{votePoints(relatedPost)}</div>
                          <div
                            onClick={e => {
                              navigate(`/post/${relatedPost.id}?publish=true`);
                            }}
                            className="transition cursor-pointer underline text-sky-600 hover:text-sky-800 visited:text-purple-600 text-sm"
                          >
                            {relatedPost.title}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <span className="text-xs">No data.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
