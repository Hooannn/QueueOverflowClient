import { PropsWithChildren, useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from './dashboard/main-nav';
import { UserNav } from './dashboard/user-nav';
import { Search } from './dashboard/search';
import useUsers from '../services/users';
import { Icons } from './icons';
import useSubscriptions from '../services/subscriptions';
import { NotificationBell } from './dashboard/notification';
import { ModeToggle } from './dashboard/mode-toggle';
import Loading from './Loading';
import useSavedPosts from '../services/saved_posts';

export default function MainLayout(props: PropsWithChildren) {
  const { getFollowersQuery, getFollowingsQuery } = useUsers();
  const { getSavedPostIdsQuery } = useSavedPosts(false);
  const { getSubscriptionsQuery } = useSubscriptions();

  const initializeApp = async () => {
    await Promise.all([getFollowersQuery.refetch(), getFollowingsQuery.refetch(), getSubscriptionsQuery.refetch(), getSavedPostIdsQuery.refetch()]);
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const appLoading = getSubscriptionsQuery.isLoading || getFollowersQuery.isLoading || getFollowingsQuery.isLoading || getSavedPostIdsQuery.isLoading;
  return (
    <>
      {appLoading ? (
        <div className="fixed inset-0 w-screen h-screen z-50 transition-opacity duration-300 ease-in-out flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-1">
                <Search />
                <ModeToggle />
                <NotificationBell />
                <UserNav />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
