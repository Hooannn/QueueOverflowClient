import { Creator, Post } from '../../services/posts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card';
import dayjs from '../../libs/dayjs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import useUsers from '../../services/users';
export default function PostCard(props: { post: Post }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Posted by <CreatorCard creator={props.post.creator} />{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{dayjs(props.post.created_at).fromNow()}</span>
              </TooltipTrigger>
              <TooltipContent>{dayjs(props.post.created_at).toDate().toUTCString()}</TooltipContent>
            </Tooltip>
          </TooltipProvider>{' '}
        </CardDescription>
        <CardTitle>Create project</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  );
}

export function CreatorCard(props: { creator: Creator }) {
  const { following, followUserMutations, unfollowUserMutations } = useUsers();
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useMemo(() => props.creator.first_name || props.creator.last_name || `User ${props.creator.id}`, [props.creator]);

  const isFollowed = useMemo(() => following.map(f => f.to_uid).includes(props.creator.id), [following, props.creator]);

  const followUser = () => {
    followUserMutations.mutate(props.creator.id);
  };

  const unfollowUser = () => {
    unfollowUserMutations.mutate(props.creator.id);
  };
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="px-0">
          @{name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={props.creator.avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@{name}</h4>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-xs text-muted-foreground">Joined {dayjs(props.creator.created_at).format('MMMM YYYY')}</span>
            </div>
            <div className="pt-4 flex flex-col gap-1 items-center justify-center">
              {user?.id === props.creator.id ? (
                <>
                  <Button variant="outline" className="w-full">
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    Start chat
                  </Button>
                  {isFollowed ? (
                    <Button variant="outline" className="w-full" onClick={() => unfollowUser()}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => followUser()}>
                      Follow
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
