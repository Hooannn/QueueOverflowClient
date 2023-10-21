import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { ContextSelect } from './ContextSelect';
import { useEffect } from 'react';
import usePosts from '../../services/posts';
import PostCard from './PostCard';

export default function DashboardPage() {
  const dashboardContext = useSelector((state: RootState) => state.app.dashboardContext);
  const { getPostsQuery } = usePosts();

  const posts = getPostsQuery.data?.data?.data;

  useEffect(() => {
    console.log(dashboardContext);
  }, [dashboardContext]);
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <ContextSelect />
      </div>
      <div>
        {posts?.map(post => (
          <PostCard post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
