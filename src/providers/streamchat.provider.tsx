import userStore from '../state/userStore';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo
} from 'react';
import { useLocation } from 'react-router-dom';
import { StreamChat, Channel } from 'stream-chat';

type StreamChatContextType = {
  client: StreamChat;
  userRoleId: string;
  userRoleToken: string;
  userType: string;
  setUserRoleInfo: (id: string, token: string) => void;
  unreadCount: number;
  activeChannel: Channel | null;
  setActiveChannel: (channel: Channel | null) => void;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  disconnectAndReset: () => void;
  connectUserToChat: () => void;
};

const StreamChatContext = createContext<StreamChatContextType | undefined>(
  undefined
);

const client = new StreamChat(
  process.env.REACT_APP_STREAM_CHAT_API_KEY as string
);

export function StreamChatProvider({ children }: { children: ReactNode }) {
  const { user } = userStore();
  const { pathname } = useLocation();

  const userName = user?.name?.first ?? '';
  const avatar = user?.avatar ?? '';
  const [userRoleId, setUserRoleId] = useState('');
  const [userRoleToken, setUserRoleToken] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null); // Initialize activeChannel
  const currentRoute = useLocation().pathname;

  const setUserRoleInfo = (id: string, token: string) => {
    setUserRoleId(id);
    setUserRoleToken(token);
  };

  const connectUserToChat = async () => {
    try {
      await client.connectUser(
        {
          id: userRoleId,
          name: userName,
          image: avatar
        },
        userRoleToken
      );
      setUnreadCount(
        client.state.users[userRoleId].total_unread_count as number
      );
      setIsConnected(true);
    } catch (e) {
      console.error('CLIENT CONNECTED FAILED', e);
    }
  };

  const disconnectAndReset = async () => {
    if (client.user) {
      await client.disconnectUser();
      setIsConnected(false);
      setUserRoleId('');
      setUserRoleToken('');
    }
  };

  const userType = useMemo(() => {
    return currentRoute.includes('tutordashboard') ? 'tutor' : 'student';
  }, [currentRoute]);

  useEffect(() => {
    if (user) {
      const role = user[userType];
      const token = user.streamTokens?.find((token) => token.type === userType);
      //@ts-ignore: petty ts check
      setUserRoleInfo(role?._id, token?.token);
    }
  }, [user]);

  useEffect(() => {
    const handleStreamChatEvent = (event: { total_unread_count?: number }) => {
      if (event.total_unread_count !== undefined) {
        setUnreadCount(event.total_unread_count);
      }
    };

    client.on(handleStreamChatEvent);

    return () => {
      client.off(handleStreamChatEvent);
    };
  }, [userRoleId]);

  return (
    <StreamChatContext.Provider
      value={{
        client,
        userRoleId,
        userRoleToken,
        userType,
        setUserRoleInfo,
        unreadCount,
        activeChannel,
        setActiveChannel,
        isConnected,
        setIsConnected,
        disconnectAndReset,
        connectUserToChat
      }}
    >
      {children}
    </StreamChatContext.Provider>
  );
}

export const useStreamChat = () => {
  const context = useContext(StreamChatContext);
  if (context === undefined) {
    throw new Error('useStreamChat must be used within a StreamChatProvider');
  }
  return context;
};
