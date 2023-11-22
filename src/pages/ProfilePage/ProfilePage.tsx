import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useUsers from '../../services/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import ProfilePosts from './ProfilePosts';
import ProfileComments from './ProfileComments';
import ProfileHistory from './ProfileHistory';
import ProfileSaved from './ProfileSaved';
import ProfileUpvoted from './ProfileUpvoted';
import ProfileDownvoted from './ProfileDownvoted';
import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IResponseData, IUser } from '../../types';
import Loading from '../../components/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

export default function ProfilePage() {
  const axios = useAxiosIns();
  const user = useSelector((state: RootState) => state.auth.user);

  const { id } = useParams();
  const isMe = id === user?.id;

  const getProfileQuery = useQuery({
    queryKey: ['fetch/profile', id],
    queryFn: () => axios.get<IResponseData<IUser>>(`/v1/users/profile/${id}`),
    enabled: !isMe,
    refetchOnWindowFocus: false,
  });

  const isLoading = getProfileQuery.isLoading;
  const profile = isMe ? user : getProfileQuery.data?.data.data;

  const name = useMemo(() => {
    if (!profile?.first_name && !profile?.last_name) return `Profile ${profile?.id}`;
    return `${profile?.first_name} ${profile?.last_name}`;
  }, [profile]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState<string>();

  useEffect(() => {
    if (!searchParams.has('tab')) {
      setTabValue('posts');
    } else {
      setTabValue(searchParams.get('tab') as string);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <Avatar className="w-40 h-40">
              <AvatarImage src={profile?.avatar} alt={name[0] + name[1]} />
              <AvatarFallback>{name[0] + name[1]}</AvatarFallback>
            </Avatar>
            <h3 className="text-lg mt-2 font-medium">{name}</h3>
            {profile?.bio && <p className="text-sm text-muted-foreground">{profile.bio}</p>}
            {profile?.urls?.map(url => (
              <a className="text-sm hover:underline transition" target="_blank" href={url.value}>
                {url.value}
              </a>
            ))}
            <div className="flex items-center justify-center gap-2 mt-8 w-[390px]">
              {isMe ? <ActionForMe /> : <ActionForStranger userId={id ?? ''} />}
            </div>
          </div>
          <Tabs
            onValueChange={value => {
              searchParams.set('tab', value);
              setSearchParams(searchParams);
              setTabValue(value);
            }}
            value={tabValue}
            className="mt-10 w-full flex flex-col items-center"
          >
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
            <TabsContent className="self-start w-full" value="posts">
              <ProfilePosts />
            </TabsContent>
            <TabsContent className="self-start w-full" value="comments">
              <ProfileComments />
            </TabsContent>
            <TabsContent className="self-start w-full" value="history">
              <ProfileHistory />
            </TabsContent>
            <TabsContent className="self-start w-full" value="saved">
              <ProfileSaved />
            </TabsContent>
            <TabsContent className="self-start w-full" value="upvoted">
              <ProfileUpvoted />
            </TabsContent>
            <TabsContent className="self-start w-full" value="downvoted">
              <ProfileDownvoted />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
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
