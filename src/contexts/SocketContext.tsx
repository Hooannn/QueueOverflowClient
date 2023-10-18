// SocketContext.tsx
import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { RootState } from '../@core/store';

// Define the context and types
type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Create a custom hook to access the socket context
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export function SocketProvider({ children, socketUrl }: PropsWithChildren<{ socketUrl: string }>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    if (isLogged && socketUrl && !socket) {
      const newSocket = io(`${socketUrl}notifications`, {
        extraHeaders: {
          uid: user?.id ?? '',
        },
      });

      newSocket.on('new-notifications', data => {
        console.log('new notifications', data);
      });

      setSocket(newSocket);
    }

    return () => {
      socket?.disconnect();
      socket?.close();
    };
  }, [isLogged, socketUrl]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
