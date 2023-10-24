import { BellIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import useNotifications from '../../services/notifications';
import { useSocket } from '../../contexts/SocketContext';
import { useEffect } from 'react';

export function NotificationBell() {
  const { notifications, unreadNotificationsCount, getUnreadNotificationsCountQuery } = useNotifications();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new-notification', () => {
        getUnreadNotificationsCountQuery.refetch();
      });
    }

    return () => {
      socket?.removeListener('new-notification');
    };
  }, [socket]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full p-0 w-10 h-10">
          {(unreadNotificationsCount ?? 0) > 0 && (
            <div className="transition absolute right-[-4px] top-[-4px] w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
              <small className="text-white">{unreadNotificationsCount}</small>
            </div>
          )}
          <BellIcon size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
