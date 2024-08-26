import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import ApiService from '../../../../../../services/ApiService';
import useUserStore from '../../../../../../state/userStore';
import { HEADER_KEY } from '../../../../../../config';
import { useSearchQuery } from '../../../../../../hooks';
import { firebaseAuth } from '../../../../../../firebase';
import { useNavigate } from 'react-router';

// Fixed server URL for the WebSocket connection
const SERVER_URL = process.env.REACT_APP_AI_API;

// Interface definitions for the chat log and chat message structures
interface ChatLog {
  role: 'assistant' | 'user' | 'function' | 'system';
  content: string;
}

export interface ChatMessage {
  id: number;
  studentId: string;
  log: ChatLog;
  liked: boolean;
  disliked: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
}

type InitConversationOptions = {
  conversationInitializer: string;
  isNewConversation: boolean;
};

interface ChatWindowConfigParams {
  isNewWindow: boolean;
  connectionQuery: Record<string, any>;
}

const debugLog = (code: string, message?: any) => {
  message = message ? `: ${message}` : '';
  if (process.env.NODE_ENV === 'development') {
    console.log(`${code.toUpperCase()} ${message}`);
  }
};

const useChatManager = (
  namespace: string,
  options?: { autoPersistChat: boolean; autoHydrateChat: boolean }
) => {
  const [firstMessageDropped, setFirstMessageDropped] = useState(false);
  const user = useUserStore((state) => state.user);
  const studentId = user?._id;
  const [isLoading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(null);
  const CHAT_WINDOW_CONFIG_PARAMS_LOCAL_STORAGE_KEY =
    `CHAT_WINDOW_CONFIG_PARAMS_FOR_${namespace}`.toUpperCase();
  const query = useQueryClient();
  // stuff NEEDED for share to work.
  const search = useSearchQuery();
  const shareable = search.get('shareable');
  const apiKey = search.get('apiKey');
  const navigate = useNavigate();
  // State hooks for managing chat messages, current chat content, and conversation ID
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChat, setCurrentChat] = useState<string>('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  const getPersistStorageKey = useCallback(
    (id?: string) => {
      id = id || conversationId;
      const persistKey = `CHAT_HISTORY_KEY_${namespace}_${id}`;
      return persistKey;
    },
    [conversationId]
  );
  // useRef to hold a persistent reference to the socket connection
  const socketRef = useRef<Socket | null>(null);

  // Helper function to force component update by updating a state that is not used elsewhere

  // useEffect hook for cleanup on component unmount to disconnect the socket
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const autoPersistChat = useCallback(() => {
    const PERSIST_CHAT_KEY = getPersistStorageKey();
    localStorage.setItem(PERSIST_CHAT_KEY, JSON.stringify(messages));
  }, [messages, getPersistStorageKey]);

  const hydrateChat = useCallback(
    (id: string) => {
      const PERSIST_CHAT_KEY = getPersistStorageKey(id);
      const storedMessagesString = localStorage.getItem(PERSIST_CHAT_KEY);
      if (storedMessagesString) {
        const storedMessages = JSON.parse(storedMessagesString);
        setMessages(storedMessages);
      }
    },
    [getPersistStorageKey]
  );

  useEffect(() => {
    if (messages.length && conversationId && options?.autoPersistChat) {
      autoPersistChat();
    }
  }, [messages, conversationId, autoPersistChat]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('aitutorchat_limit_reached', (iLimitReached) => {
        setLimitReached(iLimitReached);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('aitutorchat_limit_reached');
      }
    };
  }, [socketRef.current]);

  const resetLimitReached = () => {
    setLimitReached(false);
  };

  // useCallback for formatting messages before they are sent or stored
  const formatMessage = useCallback(
    (message: string, role: 'assistant' | 'user' = 'user'): ChatMessage => {
      return {
        id: Date.now(), // Simplified ID generation, should be unique in a real application
        studentId: studentId, // Placeholder, replace with dynamic student ID
        log: { role, content: message },
        liked: false,
        disliked: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        conversationId: conversationId || 'unknown' // Use current conversationId or fallback
      };
    },
    [conversationId]
  );

  // useCallback for sending messages through the WebSocket and updating the local state
  const sendMessage = useCallback(
    (
      message: string,
      topic: 'math' | 'rest' = 'rest',
      role: 'assistant' | 'user' = 'user'
    ) => {
      if (topic === 'math') {
        const newMessage = formatMessage(message, role);
        console.log(newMessage, 'new bot');
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setCurrentChat('');
        return;
      }
      if (!socketRef.current) {
        debugLog('SEND MESSAGE', message);
        return;
      }
      const newMessage = formatMessage(message);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socketRef.current.emit('chat message', message); // Emitting the message to the server
      debugLog('SEND MESSAGE', message);
    },
    [formatMessage]
  );

  // useCallback for fetching chat history from the server

  const fetchHistory = useCallback(
    async (limit: number, offset: number, convoId?: string) => {
      try {
        setLoading(true);
        const id = convoId || conversationId;

        if (!socketRef.current && !id) {
          console.error(
            'Socket is not initialized or conversationId is not set.'
          );
          return;
        }
        debugLog('FETCH HISTORY', { limit, offset });
        if (shareable && shareable.length > 0 && apiKey && apiKey.length > 0) {
          const data = await ApiService.getConversationByIdAndAPIKey({
            conversationId: id,
            apiKey
          });

          setMessages((prevMessages) => {
            if (offset === 0) {
              // When offset is 0, replace the first X messages with new data,
              // where X is the length of the data received.
              return [...data, ...prevMessages.slice(data.length)];
            } else {
              // When offset isn't 0, replace messages starting from the offset position
              // with the new data, ensuring no duplicates and preserving the sequence.
              // This might require adjusting depending on your specific use case or data structure.
              const updatedMessages = [...prevMessages];

              data.forEach((newMessage, index) => {
                const replaceIndex = offset + index;
                if (replaceIndex < updatedMessages.length) {
                  // Replace existing message at specific index
                  updatedMessages[replaceIndex] = newMessage;
                } else {
                  // If beyond the current list, append
                  updatedMessages.push(newMessage);
                }
              });
              return updatedMessages;
            }
          });
        } else {
          const token = await firebaseAuth.currentUser?.getIdToken();
          if (!token) {
            navigate('/signup');
          }

          const data = await ApiService.getConversionById({
            conversationId: id
          });

          setMessages((prevMessages) => {
            if (offset === 0) {
              // When offset is 0, replace the first X messages with new data,
              // where X is the length of the data received.
              return [...data, ...prevMessages.slice(data.length)];
            } else {
              // When offset isn't 0, replace messages starting from the offset position
              // with the new data, ensuring no duplicates and preserving the sequence.
              // This might require adjusting depending on your specific use case or data structure.
              const updatedMessages = [...prevMessages];

              data.forEach((newMessage, index) => {
                const replaceIndex = offset + index;
                if (replaceIndex < updatedMessages.length) {
                  // Replace existing message at specific index
                  updatedMessages[replaceIndex] = newMessage;
                } else {
                  // If beyond the current list, append
                  updatedMessages.push(newMessage);
                }
              });
              return updatedMessages;
            }
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

      // socketRef.current.emit('fetch_history', { limit, offset });
    },
    [conversationId, apiKey, navigate, shareable]
  );

  // useCallback for adding custom event listeners to the socket
  const onEvent = useCallback(
    (event: string, handler: (...args: any[]) => void) => {
      if (!socketRef.current) {
        console.warn(
          'Socket not initialized, unable to attach event listener.'
        );
        return;
      }
      socketRef.current.on(event, handler);
      debugLog('EVENT LISTENER ADDED', event);
    },
    []
  );

  const refreshManager = () => {
    setMessages([]);
    setCurrentChat('');
    setConversationId(null);
  };

  // useCallback for emitting custom events through the socket
  const emitEvent = useCallback((event: string, data?: any) => {
    if (!socketRef.current) {
      console.error('Socket is not initialized, unable to emit event.');
      return;
    }
    socketRef.current.emit(event, data);
    debugLog('EMIT EVENT', event);
  }, []);

  // Setup initial socket listeners and handlers for chat events
  const setupSocketListeners = useCallback(
    (options?: InitConversationOptions) => {
      if (!socketRef.current) return;
      const { conversationInitializer, isNewConversation } = options || {};

      // Event listener for socket connection
      socketRef.current.on('connect', () => {
        debugLog('SOCKET CONNECTED', socketRef.current?.id);
        // refreshManager();
      });

      // Handlers for chat response start and end, updating chat state accordingly
      socketRef.current.on('chat response start', (token: string) => {
        setCurrentChat((prevChat) => prevChat + token);
        // forceUpdate(); // Force update to render changes
        debugLog('CHAT RESPONSE START', token);
      });

      socketRef.current.on('new_title', (title: string) => {
        setTitle(title);
        query.invalidateQueries({
          queryKey: ['chatHistory', { studentId }]
        });
      });

      socketRef.current.on('chat response end', (newMessage: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          formatMessage(newMessage, 'assistant')
        ]);
        setCurrentChat('');
        if (!firstMessageDropped) {
          query.invalidateQueries({
            queryKey: ['chatHistory', { studentId }]
          });
          setFirstMessageDropped(true);
        }
        debugLog('CHAT RESPONSE END', newMessage);
      });

      // Handler for when the AI model is ready, fetching history or starting new conversation
      socketRef.current.on('ready', () => {
        debugLog('AI MODEL READY');
        if (isNewConversation) {
          debugLog('INITIALIZING NEW CONVERSATION BEFORE HISTORY FETCH');
          sendMessage(conversationInitializer);
          setChatWindowToStale();
        }
      });

      // Handler for setting the current conversation ID
      socketRef.current.on('current_conversation', (id: string) => {
        setConversationId(id);
        debugLog('CURRENT CONVERSATION', id);
      });
    },
    [fetchHistory, formatMessage, sendMessage]
  );

  // Initialize and configure the socket connection
  const initiateSocket = useCallback(
    (
      queryParams: Record<string, any>,
      conversationOptions?: InitConversationOptions
    ) => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect existing socket
      }
      queryParams.name = user.name.first;
      // Initialize new socket connection with server
      socketRef.current = io(SERVER_URL + '/' + namespace, {
        extraHeaders: {
          'x-shepherd-header': HEADER_KEY // Example custom header
        },
        auth: (cb) => cb(queryParams) // Authentication with query parameters
      }).connect();

      debugLog('SOCKET CONNECTED', socketRef.current.id);

      // Setup socket listeners with optional conversation starter
      setupSocketListeners(conversationOptions);
    },
    [setupSocketListeners]
  );

  // Method to set chat window params in localStorage
  const setChatWindowParams = (params: ChatWindowConfigParams) => {
    localStorage.setItem(
      CHAT_WINDOW_CONFIG_PARAMS_LOCAL_STORAGE_KEY,
      JSON.stringify(params)
    );
  };

  // Method to get chat window params from localStorage
  const getChatWindowParams = (): ChatWindowConfigParams | null => {
    const paramsString = localStorage.getItem(
      CHAT_WINDOW_CONFIG_PARAMS_LOCAL_STORAGE_KEY
    );
    if (!paramsString) return null;
    return JSON.parse(paramsString);
  };

  const setChatWindowToStale = () => {
    const chatWindowParams = getChatWindowParams();
    if (chatWindowParams) {
      setChatWindowParams({ ...chatWindowParams, isNewWindow: false });
    }
  };

  // Function to start a new conversation
  const startConversation = useCallback(
    (
      queryParams: Record<string, any>,
      conversationOptions?: InitConversationOptions
    ) => {
      const { conversationId } = queryParams;
      queryParams.name = user.name.first;
      refreshManager();
      if (conversationOptions) {
        setChatWindowParams({
          isNewWindow: conversationOptions.isNewConversation,
          connectionQuery: queryParams
        });
      }
      initiateSocket(queryParams, conversationOptions); // Initiate socket with queryParams
      if (conversationId) {
        if (options?.autoHydrateChat) {
          hydrateChat(conversationId);
        }
        fetchHistory(30, 0, conversationId);
      }
      debugLog('CONVERSATION STARTED');
    },
    [initiateSocket]
  );

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  // Returning hook state and functions to manage chat
  return {
    messages,
    currentChat,
    conversationId,
    startConversation,
    sendMessage,
    setCurrentChat,
    fetchHistory,
    hydrateChat,
    onEvent,
    emitEvent,
    setChatWindowParams,
    getChatWindowParams,
    setChatWindowToStale,
    isLoading,
    title,
    error,
    currentSocket: socketRef?.current,
    limitReached,
    resetLimitReached,
    disconnectSocket,
    setTitle,
    setConversationId,
    refreshManager
  };
};

export default useChatManager;
