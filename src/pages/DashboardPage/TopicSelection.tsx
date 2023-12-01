import React, { useEffect } from 'react';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useQuery } from 'react-query';
import { IResponseData } from '../../types';
import { Subscription } from '../../services/subscriptions';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import useDrag from './useDrag';
import './hideScrollbar.css';
type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;
export default function TopicSelection(props: { onSelectedChange: (topicId?: string | null) => void }) {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, posDiff => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });
  const axios = useAxiosIns();

  const getTopicSubscription = useQuery({
    queryKey: ['fetch/topicSubscriptionsDashboard'],
    queryFn: () =>
      axios.get<IResponseData<Subscription[]>>('/v1/subscriptions', {
        params: {
          relations: ['topic'],
        },
      }),
    refetchOnWindowFocus: false,
  });
  const [selected, setSelected] = React.useState<string | null>();
  const topicSubscriptions = getTopicSubscription.data?.data.data;

  const isItemSelected = (id: string) => selected === id;

  const handleClick = (id: string) => {
    const itemSelected = isItemSelected(id);
    if (itemSelected) {
      setSelected(null);
    } else {
      setSelected(id);
    }
  };

  useEffect(() => {
    props.onSelectedChange(selected);
  }, [selected]);

  return (
    <>
      {getTopicSubscription.isLoading ? (
        <Skeleton className="h-10 w-full min-w-[300px]" />
      ) : (
        <>
          {topicSubscriptions && topicSubscriptions?.length ? (
            <ScrollMenu
              onMouseDown={() => dragStart}
              onMouseUp={() => dragStop}
              onMouseMove={handleDrag}
              Footer={null}
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
            >
              {topicSubscriptions.map(topic => (
                <Card
                  itemId={topic.topic_id}
                  title={topic.topic?.title as string}
                  key={topic.topic_id}
                  onClick={() => handleClick(topic.topic_id)}
                  selected={isItemSelected(topic.topic_id)}
                />
              ))}
            </ScrollMenu>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = React.useContext(VisibilityContext);

  return (
    <Button className="rounded-full" size={'icon'} variant={'ghost'} disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      <ChevronLeftIcon />
    </Button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Button className="rounded-full" size={'icon'} variant={'ghost'} disabled={isLastItemVisible} onClick={() => scrollNext()}>
      <ChevronRightIcon />
    </Button>
  );
}

function Card({ onClick, selected, title }: { onClick: () => void; selected: boolean; title: string; itemId: string }) {
  return (
    <div
      className={`${
        selected ? 'bg-primary text-primary-foreground' : ''
      } cursor-pointer transition rounded-lg flex items-center justify-center p-2 border mx-1 h-full min-w-[90px]`}
      onClick={() => onClick()}
      tabIndex={0}
    >
      <div className="text-xs font-medium" style={{ whiteSpace: 'nowrap' }}>
        {title}
      </div>
    </div>
  );
}
