import { BellIcon, CheckCheck, Settings, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import useNotifications, { Notification } from '../../services/notifications';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import dayjs from '../../libs/dayjs';
import { useNavigate } from 'react-router-dom';
import { DotFilledIcon } from '@radix-ui/react-icons';
import Empty from '../Empty';
import { formats } from '../../configs/quill';
import ReactQuill from 'react-quill';
import { useTheme } from '../../contexts/ThemeContext';

export function NotificationBell() {
  const {
    markNotificationMutation,
    notifications,
    unreadNotificationsCount,
    getNotificationsQuery,
    markAllNotificationsMutation,
    deleteAllNotificationsMutation,
  } = useNotifications();
  const navigate = useNavigate();

  const ACTIONS = [
    {
      tooltip: 'Mark all notifications as read',
      icon: <CheckCheck size={18} />,
      loading: markAllNotificationsMutation.isLoading,
      handler: () => {
        markAllNotificationsMutation.mutate();
      },
    },
    {
      tooltip: 'Go to notifications setting',
      icon: <Settings size={18} />,
      loading: false,
      handler: () => {},
    },
    {
      tooltip: 'Delete all notifications',
      icon: <Trash size={18} color="red" />,
      loading: deleteAllNotificationsMutation.isLoading,
      handler: () => {
        deleteAllNotificationsMutation.mutate();
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative p-0 w-10 h-10">
          {(unreadNotificationsCount ?? 0) > 0 && (
            <div className="transition absolute right-[-4px] top-[-4px] w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <small className="text-white">{unreadNotificationsCount}</small>
            </div>
          )}
          <BellIcon size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <div>Notifications</div>
            <div>
              {ACTIONS.map(action => (
                <TooltipProvider key={action.tooltip}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button disabled={action.loading} onClick={action.handler} variant="ghost" className="relative rounded-full p-0 w-10 h-10">
                        {action.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.tooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          {getNotificationsQuery.isLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={`Skeleton::${i}`} className="w-full h-10 rounded" />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications && notifications!.length > 0 ? (
                <>
                  {notifications?.map(notification => (
                    <NotificationCard
                      onMark={id => {
                        markNotificationMutation.mutate(id);
                      }}
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </>
              ) : (
                <Empty />
              )}
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <Button onClick={() => navigate('/notifications')} className="w-full" size={'lg'} variant={'ghost'}>
          See all
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NotificationCard(props: { notification: Notification; onMark: (notificationId: string) => void }) {
  const name = useMemo(() => {
    if (!props.notification.creator?.first_name && !props.notification.creator?.last_name) return `User ${props.notification.creator?.id}`;
    return `${props.notification.creator?.first_name} ${props.notification.creator?.last_name}`;
  }, [props.notification]);
  const shortName = name[0] + name[1];

  const { raw } = useTheme();
  const [contentHeight, setContentHeight] = useState();

  const quillRef = useRef<ReactQuill>(null);
  useEffect(() => {
    if (quillRef.current) {
      const clientHeight = (quillRef.current.editingArea as any)?.clientHeight;
      setContentHeight(clientHeight);
    }
  }, []);
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        props.onMark(props.notification.id);
        window.location.href = props.notification.meta_data?.action_url;
      }}
      className={`hover:scale-[0.99] flex gap-3 items-center rounded-lg cursor-pointer transition p-2 ${props.notification.read ? '' : ''}`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={props.notification.creator?.avatar} alt={shortName} />
        <AvatarFallback>{shortName}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="text-sm">
          <span className="font-bold">{props.notification.title}</span>
        </div>
        <div className="text-sm post-card relative">
          <ReactQuill
            ref={quillRef}
            className="rounded p-0 max-h-[150px] overflow-hidden"
            readOnly
            theme="snow"
            modules={{ toolbar: false }}
            formats={formats}
            value={props.notification.content}
          />
          {contentHeight && contentHeight >= 250 && (
            <div className="absolute w-full left-0 bottom-0">
              <div className={`w-full h-8 ${raw === 'dark' ? 'overlay-dark' : 'overlay-light'}`}></div>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{dayjs(props.notification.created_at).fromNow()}</div>
      </div>

      {!props.notification.read && <DotFilledIcon className="w-6 h-6" color="orangered" />}
    </div>
  );
}
