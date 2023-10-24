import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { ContextSelect } from './ContextSelect';
import { useEffect } from 'react';
import usePosts from '../../services/posts';
import PostCard from './PostCard';

export default function DashboardPage() {
  const dashboardContext = useSelector((state: RootState) => state.app.dashboardContext);
  const { getPostMutation, posts } = usePosts();

  const refetchPostAt = async (postId: string) => {
    const res = await getPostMutation.mutateAsync(postId);
    const updatedPost = res.data.data;
    const index = posts?.findIndex(post => post.id === updatedPost.id);
    if (posts?.length && index !== undefined) {
      posts[index] = updatedPost;
    }
  };

  useEffect(() => {
    console.log(dashboardContext);
  }, [dashboardContext]);
  return (
    <div className="flex-1 space-y-4 p-4">
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
