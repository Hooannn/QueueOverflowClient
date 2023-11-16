import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { ContextSelect } from './ContextSelect';
import { useEffect, useMemo, useState } from 'react';
import usePosts from '../../services/posts';
import PostCard from './PostCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { AvatarImage, AvatarFallback, Avatar } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Image } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import Empty from '../../components/Empty';
import SharedDialog from './SharedDialog';

export default function DashboardPage() {
  const dashboardContext = useSelector((state: RootState) => state.app.dashboardContext);
  const user = useSelector((state: RootState) => state.auth.user);
  const { getPostMutation, posts, getPostsQuery } = usePosts();
  const name = useMemo(() => {
    if (!user?.first_name && !user?.last_name) return `User ${user?.id}`;
    return `${user.first_name} ${user.last_name}`;
  }, [user]);

  const shortName = name[0] + name[1];
  const refetchPostAt = async (postId: string) => {
    const res = await getPostMutation.mutateAsync(postId);
    const updatedPost = res.data.data;
    const index = posts?.findIndex(post => post.id === updatedPost.id);
    if (posts?.length && index !== undefined) {
      posts[index] = updatedPost;
    }
  };

  const navigate = useNavigate();
  const [shouldShowSharedDialog, setShowSharedDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  const showShareDialog = (postId: string, postTitle: string) => {
    setShowSharedDialog(true);
    setShareUrl(`${window.location.href}post/${postId}`);
    setShareTitle(postTitle);
  };

  useEffect(() => {
    console.log(dashboardContext);
  }, [dashboardContext]);

  return (
    <div className="flex-1 space-y-4 p-4">
      <SharedDialog shareUrl={shareUrl} title={shareTitle} onOpenChange={val => setShowSharedDialog(val)} isOpen={shouldShowSharedDialog} />
      <Card className="rounded">
        <CardContent className="p-2 flex items-center justify-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} alt={shortName} />
            <AvatarFallback>{shortName}</AvatarFallback>
          </Avatar>
          <Input onClick={() => navigate('/submit')} type="search" placeholder="Create Post" className="w-full h-12" />
          <Button onClick={() => navigate('/submit?media=true')} className="h-12 w-12 p-3" variant={'outline'}>
            <Image size={24} />
          </Button>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <ContextSelect />
      </div>
      {getPostsQuery.isLoading ? (
        <div className="flex flex-col gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`Skeleton::${i}`} className="w-full h-24 rounded" />
            ))}
        </div>
      ) : (
        <>
          {posts && posts!.length > 0 ? (
            <div className="flex flex-col gap-4">
              {posts?.map(post => (
                <PostCard
                  showSharedDialog={(postId, postTitle) => {
                    showShareDialog(postId, postTitle);
                  }}
                  isPreview
                  post={post}
                  key={post.id}
                  refetchPostAt={refetchPostAt}
                />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </>
      )}
    </div>
  );
}
