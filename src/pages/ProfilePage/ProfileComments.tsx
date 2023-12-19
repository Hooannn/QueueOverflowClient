import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useAxiosIns from '../../hooks/useAxiosIns';
import { GetQuery, Comment } from '../../services/posts';
import { IResponseData } from '../../types';
import { Skeleton } from '../../components/ui/skeleton';
import Empty from '../../components/Empty';
import CommentCard from '../DashboardPage/CommentCard';

export default function ProfileComments() {
  const { id } = useParams();
  const axios = useAxiosIns();
  const [query, setQuery] = useState<GetQuery>({
    offset: 0,
    limit: 20,
    relations: ['votes', 'creator', 'post.creator'],
  });
  const getUserCommentsQuery = useQuery({
    queryKey: ['fetch/userComments', id, query],
    queryFn: () => axios.get<IResponseData<Comment[]>>(`/v1/comments/user/${id}`, { params: query }),
    refetchOnWindowFocus: false,
  });

  const comments = getUserCommentsQuery.data?.data.data;
  return (
    <>
      <div className="w-full">
        {getUserCommentsQuery.isLoading ? (
          <div className="flex flex-col gap-4 p-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={`Skeleton::${i}`} className="w-full h-32 rounded" />
              ))}
          </div>
        ) : (
          <>
            {
              //@ts-ignore
              comments?.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {comments?.map(comment => (
                    <CommentCard isPreview key={comment.id} comment={comment} postId={comment.post_id} />
                  ))}
                </div>
              ) : (
                <>
                  <Empty text="No comments data." />
                </>
              )
            }
          </>
        )}
      </div>
    </>
  );
}
