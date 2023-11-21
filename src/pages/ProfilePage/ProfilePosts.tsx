import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IResponseData } from '../../types';
import { GetQuery, Post } from '../../services/posts';
import { Skeleton } from '../../components/ui/skeleton';
import Empty from '../../components/Empty';
import PostCard from '../DashboardPage/PostCard';
import SharedDialog from '../DashboardPage/SharedDialog';

export default function ProfilePosts() {
  const { id } = useParams();
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    offset: 0,
    limit: 20,
    relations: ['votes', 'comments', 'creator', 'topics'],
  });
  const getUserPostsQuery = useQuery({
    queryKey: ['fetch/userPosts', id, query],
    queryFn: () => axios.get<IResponseData<Post[]>>(`/v1/posts/user/${id}`, { params: query }),
    refetchOnWindowFocus: false,
  });
  const [shouldShowSharedDialog, setShowSharedDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  const showShareDialog = (postId: string, postTitle: string) => {
    setShowSharedDialog(true);
    setShareUrl(`${window.location.origin}/post/${postId}`);
    setShareTitle(postTitle);
  };

  const getPostMutation = useMutation({
    mutationFn: (postId: string) => axios.get<IResponseData<Post>>(`/v1/posts/${postId}`),
  });

  const refetchPostAt = async (postId: string) => {
    const res = await getPostMutation.mutateAsync(postId);
    const updatedPost = res.data.data;
    const index = posts?.findIndex(post => post.id === updatedPost.id);
    if (posts?.length && index !== undefined) {
      posts[index] = updatedPost;
    }
  };

  let posts = getUserPostsQuery.data?.data.data;
  return (
    <>
      <SharedDialog shareUrl={shareUrl} title={shareTitle} onOpenChange={val => setShowSharedDialog(val)} isOpen={shouldShowSharedDialog} />
      <div className="w-full">
        {getUserPostsQuery.isLoading ? (
          <div className="flex flex-col gap-4 p-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`Skeleton::${i}`} className="w-full h-32 rounded" />
              ))}
          </div>
        ) : (
          <>
            {posts?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {posts?.map(post => (
                  <PostCard isPreview showSharedDialog={showShareDialog} key={post.id} post={post} refetchPostAt={refetchPostAt} />
                ))}
              </div>
            ) : (
              <>
                <Empty text="No posts data." />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
