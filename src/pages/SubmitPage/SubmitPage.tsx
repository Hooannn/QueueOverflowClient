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
import { Topic } from '../../services/posts';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import useTopics from '../../services/topics';
import { Skeleton } from '../../components/ui/skeleton';
export type PostType = 'post' | 'media' | 'poll';
export default function SubmitPage() {
  const [postType, setPostType] = useState<PostType>('post');
  const [searchParams] = useSearchParams();
  const [postValue, setPostValue] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postTopics, setPostTopics] = useState<{ id: string }[]>([]);

  const EDITORS = [
    {
      type: 'post',
      value: <PostEditor value={postValue} onValueChange={value => setPostValue(value)} />,
    },
    {
      type: 'media',
      value: <MediaEditor />,
    },
    {
      type: 'poll',
      value: <PollEditor />,
    },
  ];

  const editor = useMemo(() => EDITORS.find(e => e.type === postType), [postType]);

  useEffect(() => {
    const isMedia = searchParams.get('media');
    if (isMedia) setPostType('media');

    const isPoll = searchParams.get('poll');
    if (isPoll) setPostType('poll');
  }, [searchParams]);

  const submit = () => {
    console.log('Submit', {
      postTopics,
      postTitle,
      postType,
      postValue,
    });
  };
  return (
    <div className="flex-1 space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create a post</h2>
      </div>
      <Card className="rounded">
        <CardContent className="p-4 flex flex-col gap-4">
          <PostTypeSelection value={postType} onValueChange={(value: PostType) => setPostType(value)} />
          <TopicSelection onValueChange={value => setPostTopics(value)} />
          <Input value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="Title" className="w-full h-12" />
          {editor?.value}
          <div className="flex items-center justify-end">
            <Button onClick={submit} size={'lg'}>
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
  const [searchText, setSearchText] = useState<string>('');
  const [shouldOpenDialog, setOpenDialog] = useState(false);

  const { getTopicsQuery, topics } = useTopics();

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
    console.log('topic clicked', topic);
  };

  const isSelected = (topicId: string) => selectedTopics.some(topic => topic.id === topicId);

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

          <Input value={searchText} onChange={e => setSearchText(e.target.value)} type="search" placeholder="Search..." className="w-full h-12" />

          <div className="flex flex-col gap-2">
            {getTopicsQuery.isLoading ? (
              <>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={`Skeleton::${i}`} className="w-full h-10 rounded" />
                  ))}
              </>
            ) : (
              <>
                {topics?.map(topic => (
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
              </>
            )}
          </div>

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
