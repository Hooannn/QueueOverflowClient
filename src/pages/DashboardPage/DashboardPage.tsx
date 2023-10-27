import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { ContextSelect } from './ContextSelect';
import { useEffect, useMemo } from 'react';
import usePosts from '../../services/posts';
import PostCard from './PostCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { AvatarImage, AvatarFallback, Avatar } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Image } from 'lucide-react';

export default function DashboardPage() {
  const dashboardContext = useSelector((state: RootState) => state.app.dashboardContext);
  const user = useSelector((state: RootState) => state.auth.user);
  const { getPostMutation, posts } = usePosts();
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

  useEffect(() => {
    console.log(dashboardContext);
  }, [dashboardContext]);
  return (
    <div className="flex-1 space-y-4 p-4">
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
      <div className="flex flex-col gap-4">
        {posts?.map(post => (
          <PostCard post={post} key={post.id} refetchPostAt={refetchPostAt} />
        ))}
      </div>
    </div>
  );
}
