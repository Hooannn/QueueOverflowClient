import { useQueryClient } from 'react-query';
import useComments from '../../services/comments';
import { useSelector } from 'react-redux';
import { Comment, Creator, VoteType } from '../../services/posts';
import { RootState } from '../../@core/store';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { DotFilledIcon, DotsVerticalIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { Popover, PopoverTrigger, PopoverContent } from '../../components/ui/popover';
import dayjs from 'dayjs';
import { ChevronUpIcon, ChevronDownIcon, MessageSquare, DotIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import { formats } from '../../configs/quill';
import { CreatorCard } from './PostCard';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import DeleteDialog from '../../components/shared/DeleteDialog';

export default function CommentCard({ comment, postId, isPreview }: { comment: Comment; postId: string; isPreview: boolean }) {
  const queryClient = useQueryClient();
  const { upvoteCommentMutation, downvoteCommentMutation, removeCommentMutation } = useComments();
  const user = useSelector((state: RootState) => state.auth.user);
  const vote = useMemo(() => comment.votes?.find(v => v.uid === user?.id), [comment, user]);
  const navigate = useNavigate();

  const votePoints = useMemo(
    () =>
      comment.votes?.reduce((prev, current) => {
        if (current.type === VoteType.Up) prev++;
        else prev--;
        return prev;
      }, 0),
    [comment],
  );

  const name = useMemo(() => {
    if (!comment.creator?.first_name && !comment.creator?.last_name) return `User ${comment.creator?.id}`;
    return `${comment.creator?.first_name} ${comment.creator?.last_name}`;
  }, [comment]);

  const shortName = name[0] + name[1];

  const remove = async () => {
    removeCommentMutation.mutateAsync(comment.id).then(() => {
      queryClient.invalidateQueries({
        queryKey: ['fetch/post', postId],
      });
      queryClient.invalidateQueries({
        queryKey: ['fetch/userComments', user?.id],
      });
      setShowDeleteDialog(false);
    });
  };

  const upvote = () => {
    upvoteCommentMutation.mutateAsync({ commentId: comment.id, postId }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ['fetch/post', postId],
      });
    });
  };

  const downvote = () => {
    downvoteCommentMutation.mutateAsync({ commentId: comment.id, postId }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ['fetch/post', postId],
      });
    });
  };

  const go = () => {
    if (isPreview) navigate(`/post/${comment.post_id}`);
  };

  const isVoting = upvoteCommentMutation.isLoading || downvoteCommentMutation.isLoading;

  const [shouldShowDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteDialog
        open={shouldShowDeleteDialog}
        isLoading={removeCommentMutation.isLoading}
        onOpenChange={v => {
          setShowDeleteDialog(v);
        }}
        onConfirm={remove}
      />
      <div
        onClick={e => {
          e.stopPropagation();
          go();
        }}
        className={`${isPreview ? 'border rounded transition pb-3 pt-1 px-4 hover:border-2 hover:border-solid hover:border-sky-200' : ''}`}
      >
        {isPreview && (
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare size={18} className="text-muted-foreground" /> <CreatorCard creator={comment.creator as Creator} />{' '}
            <span className="text-muted-foreground">commented on </span>
            <a href={`/post/${comment.post_id}`}>{comment.post?.title}</a>
            <DotIcon size={8} />
            <span className="text-muted-foreground">Posted by </span>
            <CreatorCard creator={comment.post?.creator as Creator} />
          </div>
        )}
        <div className="flex items-start gap-4 post-card">
          {!isPreview && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.creator?.avatar} alt={shortName} />
              <AvatarFallback>{shortName}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CreatorCard creator={comment.creator as Creator} />
                {isPreview && <span className="text-xs text-muted-foreground">{votePoints} points</span>}
                <DotFilledIcon className="w-2 h-2" color="grey" />
                <div className="text-xs text-muted-foreground">{dayjs(comment.created_at).fromNow()}</div>
              </div>
              {user?.id === comment.created_by && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button size={'icon'} variant={'ghost'}>
                      <DotsVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Update</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <ReactQuill className="rounded" readOnly theme="snow" modules={{ toolbar: false }} formats={formats} value={comment.content} />
            <div className="flex gap-2 mt-2">
              {!isPreview && (
                <div className="flex items-center gap-2">
                  <Button
                    isLoading={isVoting}
                    disabled={isVoting}
                    onClick={upvote}
                    variant={vote && vote.type === VoteType.Up ? 'default' : 'secondary'}
                    size={'icon'}
                  >
                    <ChevronUpIcon />
                  </Button>
                  <strong>{votePoints}</strong>
                  <Button
                    disabled={isVoting}
                    isLoading={isVoting}
                    variant={vote && vote.type === VoteType.Down ? 'default' : 'secondary'}
                    onClick={downvote}
                    size={'icon'}
                  >
                    <ChevronDownIcon />
                  </Button>
                </div>
              )}
              <Button variant="secondary">
                <ChatBubbleIcon className="mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
