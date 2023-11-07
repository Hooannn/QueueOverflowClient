import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { CheckIcon, CrossCircledIcon, ImageIcon, ListBulletIcon, PlusIcon, ReaderIcon } from '@radix-ui/react-icons';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import PostEditor from './PostEditor';
import MediaEditor from './MediaEditor';
import PollEditor from './PollEditor';
import usePosts, { PostType, Topic } from '../../services/posts';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import useTopics from '../../services/topics';
import { Skeleton } from '../../components/ui/skeleton';
import { ScrollArea } from '../../components/ui/scroll-area';
import React from 'react';
import { Icons } from '../../components/icons';
import Empty from '../../components/Empty';
import { uniqueId } from 'lodash';
import { onError } from '../../utils/error-handlers';

let typingTimeout: NodeJS.Timeout | null = null;
export default function SubmitPage() {
  const [postType, setPostType] = useState<PostType>(PostType.Post);
  const [searchParams] = useSearchParams();
  const [postValue, setPostValue] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContentLength, setPostContentLength] = useState(0);
  const [postTopics, setPostTopics] = useState<{ id: string }[]>([]);
  const { createPostMutation } = usePosts(false);
  const [rerenderKey, setRerenderKey] = useState<string>(uniqueId());
  const EDITORS = [
    {
      type: PostType.Post,
      value: (
        <PostEditor value={postValue} onValueLengthChange={length => setPostContentLength(length)} onValueChange={value => setPostValue(value)} />
      ),
    },
    {
      type: PostType.Media,
      value: <MediaEditor />,
    },
    {
      type: PostType.Poll,
      value: <PollEditor />,
    },
  ];

  const editor = useMemo(() => EDITORS.find(e => e.type === postType), [postType]);

  useEffect(() => {
    const isMedia = searchParams.get('media');
    if (isMedia) setPostType(PostType.Media);

    const isPoll = searchParams.get('poll');
    if (isPoll) setPostType(PostType.Poll);
  }, [searchParams]);

  const submit = () => {
    const keysToCheck: ('title' | 'type')[] = ['title', 'type'];
    const submitParams = {
      title: postTitle,
      content: postValue,
      type: postType,
      topics: postTopics ?? [],
    };
    let isValid = true;
    keysToCheck.forEach(key => {
      if (!submitParams[key] || !(submitParams[key]?.trim()?.length > 0)) {
        onError({ message: `Please fill out the ${key}`, name: 'Error' });
        isValid = false;
      }
    });

    if (postContentLength == 0) {
      onError({ message: `Please fill out the content`, name: 'Error' });
      isValid = false;
    }

    if (!isValid) return;

    createPostMutation.mutateAsync(submitParams).then(() => {
      setPostTitle('');
      setPostValue('');
      setPostTopics([]);
      setRerenderKey(uniqueId());
    });
  };
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2 z-200">
        <h2 className="text-3xl font-bold tracking-tight">Create a post</h2>
      </div>
      <Card className="rounded relative" key={rerenderKey}>
        {createPostMutation.isLoading && (
          <div className="absolute top-0 left-0 w-full h-full opacity-50 z-999 transition-opacity duration-300 ease-in-out flex items-center justify-center">
            <Icons.spinner className="h-16 w-16 animate-spin" />
          </div>
        )}
        <CardContent className="p-4 flex flex-col gap-4">
          <PostTypeSelection value={postType} onValueChange={(value: PostType) => setPostType(value)} />
          <TopicSelection onValueChange={value => setPostTopics(value)} />
          <Input value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="Title" className="w-full h-12" />
          {editor?.value}
          <div className="flex items-center justify-end">
            <Button isLoading={createPostMutation.isLoading} disabled={createPostMutation.isLoading} onClick={submit} size={'lg'}>
              Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function TopicSelection({ onValueChange }: { onValueChange: (topics: { id: string }[]) => void }) {
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [shouldOpenDialog, setOpenDialog] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isLoading, pages, fetchNextPage, isFetchingNextPage, setSearchString, searchString, isSearching, isSearchLoading } = useTopics();
  const addTopic = (topic: Topic) => {
    if (selectedTopics.some(sTopic => sTopic.id === topic.id)) return;
    setSelectedTopics(prev => [...prev, topic]);
  };

  const removeTopic = (topic: Topic) => {
    if (selectedTopics.some(sTopic => sTopic.id === topic.id)) {
      setSelectedTopics(prev => prev.filter(sTopic => sTopic.id !== topic.id));
    }
  };

  const topicClicked = (topic: Topic) => {
    // pass
  };

  const isSelected = (topicId: string) => selectedTopics.some(topic => topic.id === topicId);

  const onScrollCapture = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (isSearching) return;
    const target = e.nativeEvent.target as any;
    const pixelRatio = window.devicePixelRatio || 1;
    const scrollBottom = target?.scrollHeight - target?.scrollTop * pixelRatio <= target?.clientHeight * pixelRatio;
    if (!scrollBottom || isLoading || isFetchingNextPage) return;
    fetchNextPage();
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
    setIsTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  useEffect(() => {
    onValueChange(
      selectedTopics.map(topic => ({
        id: topic.id,
      })),
    );
  }, [selectedTopics]);

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTopics.map(topic => (
        <Button onClick={() => topicClicked(topic)} className="relative" size={'sm'} variant={'outline'} key={topic.id}>
          {topic.title}

          <CrossCircledIcon
            onClick={e => {
              e.stopPropagation();
              removeTopic(topic);
            }}
            className="hover:scale-[0.96] cursor-pointer transition z-200 absolute top-[-4px] right-[-4px]"
          />
        </Button>
      ))}
      <Button onClick={() => setOpenDialog(true)} size={'sm'} variant={'outline'}>
        <PlusIcon className="mr-1" />
        Add topic
      </Button>

      <Dialog open={shouldOpenDialog} onOpenChange={value => setOpenDialog(value)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add topic</DialogTitle>
          </DialogHeader>

          <Input value={searchString} onChange={onSearchInputChange} type="search" placeholder="Search..." className="w-full h-12" />

          {isLoading || isSearchLoading || isTyping ? (
            <div className="flex flex-col gap-2 h-[50vh] w-full justify-around">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={`Skeleton::${i}`} className="w-full h-1/6 rounded" />
                ))}
            </div>
          ) : (
            <>
              {pages && pages?.length > 0 ? (
                <ScrollArea onScrollCapture={onScrollCapture} className="h-[50vh] w-full">
                  <div className="flex flex-col gap-2">
                    {pages.map((group, i) => (
                      <>
                        {group?.data?.data?.length > 0 ? (
                          <React.Fragment key={i}>
                            {group?.data?.data?.map(topic => (
                              <Card
                                onClick={() => {
                                  if (isSelected(topic.id)) {
                                    removeTopic(topic);
                                  } else {
                                    addTopic(topic);
                                  }
                                }}
                                key={topic.id}
                                className="p-0 rounded cursor-pointer transition hover:scale-[0.99]"
                              >
                                <CardHeader className="p-4">
                                  <div className="flex gap-2 items-center justify-between">
                                    <div>
                                      <CardTitle>{topic.title}</CardTitle>
                                      <CardDescription>{topic.description ?? 'No description provided.'}</CardDescription>
                                    </div>
                                    {isSelected(topic.id) && <CheckIcon className="w-4 h-4" />}
                                  </div>
                                </CardHeader>
                              </Card>
                            ))}
                          </React.Fragment>
                        ) : (
                          <Empty />
                        )}
                      </>
                    ))}
                    {isFetchingNextPage && (
                      <div className="w-full flex items-center justify-center">
                        <Icons.spinner className="h-8 w-8 animate-spin" />
                      </div>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <Empty />
              )}
            </>
          )}

          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)} size={'lg'}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PostTypeSelection({ value, onValueChange }: { value: PostType; onValueChange: (value: PostType) => void }) {
  const POST_TYPES = [
    {
      value: 'post',
      label: (
        <>
          <ReaderIcon className="mb-3 h-6 w-6" />
          Post
        </>
      ),
    },
    {
      value: 'media',
      label: (
        <>
          <ImageIcon className="mb-3 h-6 w-6" />
          Image & Video
        </>
      ),
    },
    {
      value: 'poll',
      label: (
        <>
          <ListBulletIcon className="mb-3 h-6 w-6" />
          Poll
        </>
      ),
    },
  ];

  return (
    <RadioGroup onValueChange={onValueChange} value={value} defaultValue={POST_TYPES[0].value} className="grid grid-cols-3 gap-4">
      {POST_TYPES.map(type => (
        <div key={type.value}>
          <RadioGroupItem value={type.value} id={type.value} className="peer sr-only" />
          <Label
            htmlFor={type.value}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            {type.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
