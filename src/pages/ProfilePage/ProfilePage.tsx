import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import useUsers from '../../services/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfilePosts from './ProfilePosts';
import ProfileComments from './ProfileComments';
import ProfileHistory from './ProfileHistory';
import ProfileSaved from './ProfileSaved';
import ProfileUpvoted from './ProfileUpvoted';
import ProfileDownvoted from './ProfileDownvoted';
import MAvatar from '../../components/shared/MAvatar';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useMemo(() => {
    if (!user?.first_name && !user?.last_name) return `User ${user?.id}`;
    return `${user?.first_name} ${user?.last_name}`;
  }, [user]);
  const { id } = useParams();
  const isMe = id === user?.id;
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <MAvatar size={40} />
        <div className="mt-2 text-lg">{name}</div>
        <div className="flex items-center justify-center gap-2 mt-8 w-[390px]">
          {isMe ? <ActionForMe /> : <ActionForStranger userId={id ?? ''} />}
        </div>
      </div>
      <Tabs defaultValue="posts" className="mt-10 w-full flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          {isMe && (
            <>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="upvoted">Upvoted</TabsTrigger>
              <TabsTrigger value="downvoted">Downvoted</TabsTrigger>
            </>
          )}
        </TabsList>
        <TabsContent className="self-start" value="posts">
          <ProfilePosts />
        </TabsContent>
        <TabsContent className="self-start" value="comments">
          <ProfileComments />
        </TabsContent>
        <TabsContent className="self-start" value="history">
          <ProfileHistory />
        </TabsContent>
        <TabsContent className="self-start" value="saved">
          <ProfileSaved />
        </TabsContent>
        <TabsContent className="self-start" value="upvoted">
          <ProfileUpvoted />
        </TabsContent>
        <TabsContent className="self-start" value="downvoted">
          <ProfileDownvoted />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function ActionForMe() {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate('/settings/profile')} variant={'secondary'} className="w-1/2" size={'lg'}>
        Edit
      </Button>
      <Button onClick={() => navigate('/submit')} className="w-1/2" size={'lg'}>
        New Post
      </Button>
    </>
  );
}

export function ActionForStranger({ userId }: { userId: string }) {
  const { following, followUserMutations, unfollowUserMutations, getFollowingsQuery } = useUsers();
  const isFollowed = useMemo(() => following.map(f => f.to_uid).includes(userId), [following, userId]);
  const isLoading = followUserMutations.isLoading || unfollowUserMutations.isLoading || getFollowingsQuery.isLoading;

  const followUser = () => {
    followUserMutations.mutate(userId);
  };

  const unfollowUser = () => {
    unfollowUserMutations.mutate(userId);
  };
  return (
    <>
      <Button size={'lg'} variant="secondary" className="w-1/2">
        Start chat
      </Button>
      {isFollowed ? (
        <Button size={'lg'} isLoading={isLoading} disabled={isLoading} variant="secondary" className="w-1/2" onClick={() => unfollowUser()}>
          Unfollow
        </Button>
      ) : (
        <Button size={'lg'} isLoading={isLoading} disabled={isLoading} className="w-1/2" onClick={() => followUser()}>
          Follow
        </Button>
      )}
    </>
  );
}
