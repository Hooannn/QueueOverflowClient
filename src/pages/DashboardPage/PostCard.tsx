import usePosts, { Comment, Creator, Post, Topic, VoteType } from '../../services/posts';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { BellIcon, BellMinusIcon, CalendarDays, ChevronDownCircle, ChevronUpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card';
import dayjs from '../../libs/dayjs';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../components/ui/tooltip';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../@core/store';
import useUsers from '../../services/users';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../components/icons';
import {
  BookmarkIcon,
  ChatBubbleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DotFilledIcon,
  DotsVerticalIcon,
  EyeOpenIcon,
  Share2Icon,
} from '@radix-ui/react-icons';
import useSubscriptions from '../../services/subscriptions';
import { useQuery, useQueryClient } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IResponseData } from '../../types';
import { Skeleton } from '../../components/ui/skeleton';
import ReactQuill from 'react-quill';
import './PostCard.css';
import { useTheme } from '../../contexts/ThemeContext';
import { formats } from '../../configs/quill';
import { Separator } from '../../components/ui/separator';
import useComments from '../../services/comments';
import { onError } from '../../utils/error-handlers';
import Empty from '../../components/Empty';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import useSavedPosts from '../../services/saved_posts';
import usePostSubscriptions from '../../services/post_subscriptions';
import CommentCard from './CommentCard';
export default function PostCard(props: {
  showSharedDialog: (postId: string, postTitle: string) => void;
  isPreview: boolean;
  post: Post;
  refetchPostAt: (postId: string) => void;
}) {
  const { upvoteMutation, downvoteMutation } = usePosts(false);
  const { createSavedPostMutation, removeSavedPostMutation, savedPostIds, getSavedPostIdsQuery } = useSavedPosts(false);
  const navigate = useNavigate();
  const { subscriptions } = useSubscriptions();
  const { postSubscriptions, createPostSubscriptionMutation, getPostSubscriptionsQuery, removePostSubscriptionMutation } = usePostSubscriptions();
  const { raw } = useTheme();
  const isSubscribed = useCallback(
    (topicId: string) => {
      return subscriptions.map(s => s.topic_id).includes(topicId);
    },
    [subscriptions],
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const vote = useMemo(() => props.post.votes?.find(v => v.uid === user?.id), [props.post, user]);

  const isSaved = useMemo(() => savedPostIds.includes(props.post.id), [savedPostIds]);

  const isFollowed = useMemo(() => postSubscriptions.some(sub => sub.post_id === props.post.id && sub.uid === user?.id), [postSubscriptions]);

  const upvote = () => {
    upvoteMutation.mutateAsync(props.post.id).then(() => props.refetchPostAt(props.post.id));
  };

  const downvote = () => {
    downvoteMutation.mutateAsync(props.post.id).then(() => props.refetchPostAt(props.post.id));
  };

  const follow = () => {
    createPostSubscriptionMutation.mutateAsync(props.post.id).then(() => {
      getPostSubscriptionsQuery.refetch();
    });
  };

  const unfollow = () => {
    removePostSubscriptionMutation.mutateAsync(props.post.id).then(() => {
      getPostSubscriptionsQuery.refetch();
    });
  };

  const savePost = () => {
    createSavedPostMutation.mutateAsync(props.post.id).then(() => getSavedPostIdsQuery.refetch());
  };

  const removeSavedPost = () => {
    removeSavedPostMutation.mutateAsync(props.post.id).then(() => getSavedPostIdsQuery.refetch());
  };

  const goToPost = () => {
    if (!props.isPreview) return;
    navigate(`/post/${props.post.id}`);
  };

  const isLoading = upvoteMutation.isLoading || downvoteMutation.isLoading;

  const votePoints = useMemo(
    () =>
      props.post.votes?.reduce((prev, current) => {
        if (current.type === VoteType.Up) prev++;
        else prev--;
        return prev;
      }, 0),
    [props.post],
  );

  const ACTIONS =
    user?.id === props.post.created_by
      ? [
          {
            title: `${props.post.comments?.length} Comments`,
            tooltip: 'Total comments of this post',
            icon: <ChatBubbleIcon className="mr-2" />,
            action: goToPost,
          },
          {
            title: `Share`,
            tooltip: 'Share this post if you think this is useful',
            icon: <Share2Icon className="mr-2" />,
            action: () => {
              props.showSharedDialog(props.post.id, props.post.title);
            },
          },
          {
            title: isSaved ? `Saved` : 'Save',
            tooltip: isSaved ? 'Remove this post from your saved collection' : 'Save this post to your collection',
            icon: <BookmarkIcon className="mr-2" />,
            buttonVariant: isSaved ? 'default' : 'secondary',
            isLoading: createSavedPostMutation.isLoading || removeSavedPostMutation.isLoading || getSavedPostIdsQuery.isLoading,
            action: isSaved ? removeSavedPost : savePost,
          },
        ]
      : [
          {
            title: `${props.post.comments?.length} Comments`,
            tooltip: 'Total comments of this post',
            icon: <ChatBubbleIcon className="mr-2" />,
            action: goToPost,
          },
          {
            title: `Share`,
            tooltip: 'Share this post if you think this is useful',
            icon: <Share2Icon className="mr-2" />,
            action: () => {
              props.showSharedDialog(props.post.id, props.post.title);
            },
          },
          {
            title: isSaved ? `Saved` : 'Save',
            tooltip: isSaved ? 'Remove this post from your saved collection' : 'Save this post to your collection',
            icon: <BookmarkIcon className="mr-2" />,
            buttonVariant: isSaved ? 'default' : 'secondary',
            isLoading: createSavedPostMutation.isLoading || removeSavedPostMutation.isLoading || getSavedPostIdsQuery.isLoading,
            action: isSaved ? removeSavedPost : savePost,
          },
          {
            title: isFollowed ? `Followed` : 'Follow',
            tooltip: isFollowed ? 'Unfollow this post to stop receiving notifications' : 'Follow this post to receive notifications',
            icon: <EyeOpenIcon className="mr-2" />,
            isLoading: createPostSubscriptionMutation.isLoading || removePostSubscriptionMutation.isLoading || getPostSubscriptionsQuery.isLoading,
            buttonVariant: isFollowed ? 'default' : 'secondary',
            action: isFollowed ? unfollow : follow,
          },
        ];

  const [contentHeight, setContentHeight] = useState();

  const quillRef = useRef<ReactQuill>(null);
  useEffect(() => {
    if (quillRef.current) {
      const clientHeight = (quillRef.current.editingArea as any)?.clientHeight;
      setContentHeight(clientHeight);
    }
  }, []);

  return (
    <Card onClick={goToPost} className={`rounded transition ${props.isPreview ? 'hover:border-2 hover:border-solid hover:border-sky-200' : ''}`}>
      <div className="flex">
        <div className="flex flex-col gap-1 justify-start pt-6 items-center pl-6 relative">
          {isLoading && (
            <div className="absolute top-0 left-0 h-full w-full bg-white opacity-70 z-50 transition-opacity duration-300 ease-in-out flex items-center justify-center">
              <Icons.spinner className="h-4 w-4 animate-spin" />
            </div>
          )}
          <ChevronUpCircle
            onClick={e => {
              e.stopPropagation();
              upvote();
            }}
            size={28}
            className={`${vote && vote.type === VoteType.Up ? 'text-red-400' : ''} rounded-full hover:text-red-400 cursor-pointer transition`}
          />
          <div className="text-center">{votePoints}</div>
          <ChevronDownCircle
            onClick={e => {
              e.stopPropagation();
              downvote();
            }}
            size={28}
            className={`${vote && vote.type === VoteType.Down ? 'text-red-400' : ''} rounded-full hover:text-red-400 cursor-pointer transition`}
          />
        </div>
        <div className="w-full">
          <CardHeader>
            <div className="flex flex-wrap gap-1">
              {props.post.topics?.map(topic => (
                <TopicCard key={topic.id} topic={topic} isSubscribed={isSubscribed(topic.id)} />
              ))}
            </div>
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
            <CardTitle>{props.post.title}</CardTitle>
          </CardHeader>
          <CardContent className="relative post-card">
            <ReactQuill
              ref={quillRef}
              className={`p-0 ${props.isPreview ? 'max-h-[250px]' : ''} overflow-hidden`}
              value={props.post.content}
              formats={['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'list', 'bullet', 'indent', 'link', 'image']}
              readOnly={true}
              theme={'snow'}
              modules={{ toolbar: false }}
            ></ReactQuill>
            {props.isPreview && contentHeight && contentHeight >= 250 && (
              <div className="absolute w-full p-6 left-0 bottom-0">
                <div className={`w-full h-12 ${raw === 'dark' ? 'overlay-dark' : 'overlay-light'}`}></div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            {ACTIONS.map(action => (
              <TooltipProvider key={action.title}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={(action.buttonVariant as any) ?? 'secondary'}
                      isLoading={action.isLoading ?? false}
                      onClick={e => {
                        e.stopPropagation();
                        action.action();
                      }}
                    >
                      {action.icon}
                      {action.title}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{action.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </CardFooter>

          {!props.isPreview && (
            <CardContent>
              <CommentSection postId={props.post.id} creator={props.post.creator} comments={props.post.comments} />
            </CardContent>
          )}
        </div>
      </div>
    </Card>
  );
}

export function CommentSection(props: { postId: string; creator: Creator; comments: Comment[] }) {
  const quillRef = useRef<ReactQuill>(null);
  const [commentValue, setCommentValue] = useState<string>();
  const [commentContentLength, setCommentContentLength] = useState<number>();
  const queryClient = useQueryClient();
  const updateValueLength = () => {
    const innerText = (quillRef?.current?.editingArea as any)?.innerText;
    const replaceBreak = (innerText as string).replace('\n', '');
    const length = replaceBreak.trim().length;
    setCommentContentLength(length);
  };

  const { createCommentMutation } = useComments();

  const submitComment = () => {
    if (commentContentLength == 0 || !commentValue) {
      return onError({ message: 'Please enter a comment', name: 'Error' });
    }

    createCommentMutation
      .mutateAsync({
        content: commentValue,
        post_id: props.postId,
      })
      .then(() => {
        setCommentValue('');
        setCommentContentLength(0);
        queryClient.invalidateQueries({
          queryKey: ['fetch/post', props.postId],
        });
      });
  };
  return (
    <div>
      <div className="flex flex-col gap-1">
        <small>
          Comment as <CreatorCard creator={props.creator} />
        </small>
        <ReactQuill
          ref={quillRef}
          placeholder="What are your thoughts"
          className="rounded"
          readOnly={createCommentMutation.isLoading}
          theme="snow"
          value={commentValue}
          onChange={e => {
            updateValueLength();
            setCommentValue(e);
          }}
        />
        <div className="flex items-center justify-end">
          <Button isLoading={createCommentMutation.isLoading} onClick={submitComment}>
            Comment
          </Button>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        {props.comments?.length > 0 ? (
          <>
            {props.comments.map(comment => (
              <CommentCard isPreview={false} key={comment.id} comment={comment} postId={props.postId} />
            ))}
          </>
        ) : (
          <div className="w-1/2 flex items-center justify-center mx-auto">
            <Empty text="No comments." />
          </div>
        )}
      </div>
    </div>
  );
}

export function TopicCard(props: { topic: Topic; isSubscribed: boolean }) {
  const axios = useAxiosIns();
  const { removeSubscriptionsMutation, createSubscriptionsMutation, getSubscriptionsQuery } = useSubscriptions();
  const getTopicDetailQuery = useQuery({
    queryKey: ['fetch/topic', props.topic.id],
    queryFn: () => axios.get<IResponseData<Topic>>(`/cms/v1/topics/${props.topic.id}`),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const isLoading = removeSubscriptionsMutation.isLoading || createSubscriptionsMutation.isLoading || getSubscriptionsQuery.isLoading;

  const topicDetail = getTopicDetailQuery.data?.data?.data;

  const onTriggerOpen = (value: boolean) => {
    if (!value) return;
    getTopicDetailQuery.refetch();
  };

  const subscribe = () => {
    createSubscriptionsMutation.mutateAsync(props.topic.id).then(() => getTopicDetailQuery.refetch());
  };

  const unsubscribe = () => {
    removeSubscriptionsMutation.mutateAsync(props.topic.id).then(() => getTopicDetailQuery.refetch());
  };

  return (
    <HoverCard onOpenChange={onTriggerOpen}>
      <HoverCardTrigger asChild>
        <Button size="sm" className="h-6 px-2 py-1 bg-sky-100 cursor-pointer transition" variant="secondary">
          <div className="text-xs text-sky-900 flex gap-1">
            {props.isSubscribed && <EyeOpenIcon />} {props.topic.title}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-2">
          {getTopicDetailQuery.isLoading ? (
            <Skeleton className="w-full h-[20px] rounded-full" />
          ) : (
            <div className="flex items-center justify-between text-sm">
              <div className="font-bold">{topicDetail?.subscriptions_count} subscribers</div>
              <div>{topicDetail?.posts_count} posts</div>
            </div>
          )}

          {props.topic.description ? (
            <div className="text-sm">{props.topic.description}</div>
          ) : (
            <div className="text-sm text-muted-foreground">There are no description about this topic...</div>
          )}
          {props.isSubscribed ? (
            <Button
              isLoading={isLoading}
              onClick={e => {
                e.stopPropagation();
                unsubscribe();
              }}
              size={'lg'}
              className="w-full"
            >
              <BellMinusIcon size={16} className="mr-1" />
              Unsubscribe
            </Button>
          ) : (
            <Button
              isLoading={isLoading}
              onClick={e => {
                e.stopPropagation();
                subscribe();
              }}
              size={'lg'}
              className="w-full"
            >
              <BellIcon size={16} className="mr-1" />
              Subscribe
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export function CreatorCard(props: { creator: Creator }) {
  const { following, followUserMutations, unfollowUserMutations, getFollowingsQuery } = useUsers();
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useMemo(() => props.creator.first_name || props.creator.last_name || `User ${props.creator.id}`, [props.creator]);

  const isFollowed = useMemo(() => following.map(f => f.to_uid).includes(props.creator.id), [following, props.creator]);
  const isLoading = followUserMutations.isLoading || unfollowUserMutations.isLoading || getFollowingsQuery.isLoading;

  const followUser = () => {
    followUserMutations.mutate(props.creator.id);
  };

  const unfollowUser = () => {
    unfollowUserMutations.mutate(props.creator.id);
  };

  const navigate = useNavigate();

  const navigateToProfilePage = () => navigate(`/profile/${props.creator.id}`);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          onClick={e => {
            e.stopPropagation();
            navigateToProfilePage();
          }}
          variant="link"
          className="px-0"
        >
          @{name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={props.creator.avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4
              onClick={e => {
                e.stopPropagation();
                navigateToProfilePage();
              }}
              className="text-sm font-semibold cursor-pointer"
            >
              @{name}
            </h4>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-xs text-muted-foreground">Joined {dayjs(props.creator.created_at).format('MMMM YYYY')}</span>
            </div>
            <div className="pt-4 flex flex-col gap-1 items-center justify-center">
              {user?.id === props.creator.id ? (
                <>
                  <Button size={'lg'} variant="outline" className="w-full">
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button size={'lg'} variant="outline" className="w-full">
                    Start chat
                  </Button>
                  {isFollowed ? (
                    <Button
                      size={'lg'}
                      isLoading={isLoading}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                      onClick={() => unfollowUser()}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button size={'lg'} isLoading={isLoading} disabled={isLoading} className="w-full" onClick={() => followUser()}>
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
