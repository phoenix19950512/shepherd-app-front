import { ShareIcon } from '../../../../../../components/icons';
import useUserStore from '../../../../../../state/userStore';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useChatManager, {
  ChatMessage as ChatMessageType
} from '../hooks/useChatManager';
import ChatMessage from './_components/chat-message';
import PromptInput from './_components/prompt-input';
import ChatInfoDropdown from './_components/chat-info-dropdown';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ShareModal from '../../../../../../components/ShareModal';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { useSearchQuery } from '../../../../../../hooks';
import PlansModal from '../../../../../../components/PlansModal';
import { encodeQueryParams } from '../../../../../../helpers';
import ApiService from '../../../../../../services/ApiService';
const CONVERSATION_INITIALIZER = 'Shall we begin, Socrates?';
const KEYWORD =
  'We can tell that this query is complex and we suggest using a human tutor for better understanding of the subject matter.';
function ChatRoom() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useUserStore();
  const search = useSearchQuery();
  const apiKey = search.get('apiKey');
  const hasInitialMessagesParam = search.get('initial_messages');

  const studentId = user?._id;
  const query = useQueryClient();

  const [openPricingModel, setOpenPricingModel] = useState(false); // It will open when conversation is in share mode and user try to chat

  const {
    startConversation,
    conversationId,
    messages,
    currentChat,
    title,
    sendMessage,
    setCurrentChat,
    fetchHistory,
    onEvent,
    currentSocket,
    getChatWindowParams,
    setTitle,
    setConversationId,
    ...rest
  } = useChatManager('homework-help', {
    autoHydrateChat: true,
    autoPersistChat: true
  });

  const [autoScroll, setAutoScroll] = useState(true);
  const [streamEnded, setStreamEnded] = useState(true);
  const isFirstRun = useRef(true);
  const [subject, setSubject] = useState<'Math' | 'any'>('any');
  const [handleDisabledForMaths, setHandleDisabledForMaths] = useState(false);
  const createMathConvoLogMutation = useMutation({
    mutationFn: (b: {
      query: string;
      conversationId: string;
      studentId: string;
    }) => ApiService.createConvoLog(b)
  });
  const chatWindowParams = getChatWindowParams();
  const { connectionQuery } = chatWindowParams;
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      const chatWindowParams = getChatWindowParams();
      const { connectionQuery } = chatWindowParams;
      if (
        hasInitialMessagesParam &&
        connectionQuery.subject === 'Math' &&
        user
      ) {
        setConversationId(id);
        const b = {
          ...connectionQuery,
          studentId,
          language:
            connectionQuery.language && connectionQuery.language.length > 0
              ? connectionQuery.language
              : 'English',
          conversationId: id,
          firebaseId: user?.firebaseId,
          name: user.name.first,
          query: '',
          messages: JSON.stringify([])
        };
        const q = encodeQueryParams(b);
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.delete('initial_messages');
        window.history.replaceState(
          {},
          '',
          `${location.pathname}?${newSearchParams.toString()}`
        );

        setStreamEnded(false);
        const startSSE = () => {
          // Make a GET request to the SSE endpoint
          fetch(`${process.env.REACT_APP_AI_II}/solve/${q}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
              'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
            }
          })
            .then((response) => {
              // Check if the response is OK, before continuing
              if (!response.ok) {
                throw new Error('Failed to connect to SSE endpoint');
              }

              // Start processing incoming events
              const reader = response.body.getReader();
              const decoder = new TextDecoder('utf-8');
              let buffer = '';

              reader.read().then(function processText({ done, value }) {
                if (done) {
                  // delay a bit and then fetch the title
                  setTimeout(() => {
                    fetch(
                      `${process.env.REACT_APP_AI_II}/conversations/title/?id=${id}`,
                      {
                        headers: {
                          'X-Shepherd-Header':
                            process.env.REACT_APP_AI_HEADER_KEY
                        }
                      }
                    )
                      .then((resp) => resp.json())
                      .then(async (d: { data: string }) => {
                        setTitle(d.data);
                      })
                      .finally(async () => {
                        await query.invalidateQueries({
                          queryKey: ['chatHistory']
                        });
                      });
                  }, 700);
                  setStreamEnded(true);
                  return;
                }

                buffer += decoder.decode(value, { stream: true });

                handleSSE(buffer);
                setAutoScroll(true);

                return reader.read().then(processText);
              });
            })
            .catch((error) => {
              setStreamEnded(true);
            });
        };
        startSSE();

        query.invalidateQueries({
          queryKey: ['chatHistory', { studentId }]
        });
        setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => {
    const chatWindowParams = getChatWindowParams();
    const { connectionQuery } = chatWindowParams;
    const searchIncludesInitialMessages =
      window.location.search.includes('initial_messages');

    console.log('chatWindowParams', chatWindowParams);
    const id = window.location.pathname.split('/').at(-1);
    if (
      chatWindowParams &&
      ((connectionQuery.subject === 'Math' &&
        connectionQuery.topicSecondary?.trim().length !== 0) ||
        connectionQuery.subject !== 'Math')
    ) {
      const { isNewWindow, connectionQuery } = chatWindowParams;

      startConversation(
        {
          studentId: user._id,
          conversationId: id,
          firebaseId: user?.firebaseId,
          ...connectionQuery,
          topic:
            connectionQuery.subject === 'Math'
              ? connectionQuery.topicSecondary
              : connectionQuery.topic
        },
        {
          conversationInitializer: CONVERSATION_INITIALIZER,
          isNewConversation: isNewWindow
        }
      );
      setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
    } else if (
      apiKey &&
      ((connectionQuery.subject === 'Math' &&
        connectionQuery.topicSecondary?.trim().length !== 0) ||
        connectionQuery.subject !== 'Math')
    ) {
      startConversation(
        {
          conversationId: id
        },
        {
          conversationInitializer: CONVERSATION_INITIALIZER,
          isNewConversation: false
        }
      );
    } else if (!searchIncludesInitialMessages) {
      rest.refreshManager();
      rest.hydrateChat(id);
      fetchHistory(30, 0, id);
      setConversationId(id);
      setSubject(connectionQuery.subject === 'Math' ? 'Math' : 'any');
    }

    query.invalidateQueries({
      queryKey: ['chatHistory', { studentId }]
    });
  }, [id]);

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages.some(
        (el) => el.log.content.includes(KEYWORD) || el.log.content === KEYWORD
      )
    ) {
      setHandleDisabledForMaths(true);
    }
  }, [messages]);

  const currentChatRender = useMemo(() => {
    // This useCallback will return the ChatMessage component or null based on currentChat's value
    // It ensures that the component is only re-rendered when currentChat changes
    console.log('current chat is', currentChat);
    if (currentChat.length === 0) {
      console.log(currentChat, 'should be empty');
      return ''; // Don't render anything if there's no current chat content
    }

    return (
      <ChatMessage
        streaming={!streamEnded}
        key={Math.random()}
        id={'current-chat'}
        message={currentChat}
        type={'bot'}
      />
    );
  }, [currentChat, streamEnded]);

  const handleAutoScroll = () => {
    setAutoScroll(true);
  };
  const handleSSE = async (buffer: string) => {
    if (buffer.includes(KEYWORD) || buffer === KEYWORD) {
      setHandleDisabledForMaths(true);
      return;
    }
    if (buffer.includes('run out of credits')) {
      setOpenPricingModel(true);
      setHandleDisabledForMaths(true);
      return;
    }
    if (buffer.includes('done with stream')) {
      sendMessage(buffer.split('done with stream')[0], 'math', 'assistant');
      setStreamEnded(true);
      setAutoScroll(true);

      return;
    }

    // Append the streamed text data to the current state
    setCurrentChat(buffer);
    setAutoScroll(true);
  };
  useEffect(() => {
    setAutoScroll(Boolean(currentChat));
  }, [currentChat]);

  return (
    <div className="h-full overflow-hidden bg-transparent flex justify-center min-w-[375px] mx-auto w-full px-2">
      <div className="interaction-area w-full max-w-[832px] mx-auto flex flex-col relative">
        <div
          className="glass-top absolute top-0 pointer-events-none w-full h-[70px] inset-0 backdrop-blur-xl z-10"
          style={{
            maskImage: 'linear-gradient(black 60%, transparent)'
          }}
        ></div>
        <header className="flex justify-center absolute top-[4%] items-center w-full z-10">
          <ChatInfoDropdown
            title={title}
            id={id}
            disabled={apiKey || handleDisabledForMaths ? true : false}
          />
          <button className="absolute right-0 top-0 flex items-center justify-center mr-4 sm:mr-8 p-2 rounded-lg bg-white shadow-md">
            <ShareModal type="aichat" customTriggerComponent={<ShareIcon />} />
          </button>
        </header>
        <div className="chat-area flex-1 overflow-y-scroll pt-[6rem] pb-[12rem] px-3 w-full mx-auto max-w-[728px] flex flex-col gap-3 no-scrollbar relative scroll-smooth">
          {messages
            ?.filter(
              (message) => message.log.content !== CONVERSATION_INITIALIZER
            )
            .filter((message) => message.log.role !== 'function')
            .sort((a, b) => a.id - b.id)
            .map((message) => (
              <ChatMessage
                key={message.id}
                message={message.log.content}
                type={message.log.role === 'user' ? 'user' : 'bot'}
                userImage={user ? user.avatar : null}
                userName={
                  user ? user.name.first + ' ' + user.name.last : 'John Doe'
                }
                suggestionPromptsVisible={
                  message.id === messages[messages.length - 1].id &&
                  messages.length >= 4 &&
                  (apiKey || handleDisabledForMaths ? false : true) &&
                  connectionQuery.subject !== 'Math'
                }
                sendSuggestedPrompt={async (message: string) => {
                  if (subject === 'Math') {
                    const chatWindowParams = getChatWindowParams();
                    const { connectionQuery } = chatWindowParams;
                    const fetchedMessages: Array<ChatMessageType> =
                      await ApiService.getConversionById({
                        conversationId: id
                      });
                    const updatedMessages = fetchedMessages
                      .sort((a, b) => a.id - b.id)
                      .map((el) => el.log);

                    console.log('sorted messages are:', updatedMessages);
                    const lastMessage = updatedMessages.at(-1);

                    if (lastMessage.role === 'user') {
                      const d = await createMathConvoLogMutation.mutateAsync({
                        query: message,
                        studentId,
                        conversationId: id
                      });
                      updatedMessages.push(d.data.log);
                    }
                    const body = {
                      ...connectionQuery,
                      studentId,
                      language:
                        connectionQuery.language &&
                        connectionQuery.language.length > 0
                          ? connectionQuery.language
                          : 'English',
                      firebaseId: user.firebaseId,
                      conversationId: id,
                      name: user.name.first,
                      query: message,
                      messages: JSON.stringify(updatedMessages)
                    };
                    setStreamEnded(false);
                    const q = encodeQueryParams(body);
                    sendMessage(message, 'math');
                    handleAutoScroll();
                    const startSSE = () => {
                      // Make a GET request to the SSE endpoint
                      fetch(`${process.env.REACT_APP_AI_II}/solve/${q}`, {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'text/event-stream',
                          'Cache-Control': 'no-cache',
                          Connection: 'keep-alive',
                          'X-Shepherd-Header':
                            process.env.REACT_APP_AI_HEADER_KEY
                        }
                      })
                        .then((response) => {
                          // Check if the response is OK, before continuing
                          if (!response.ok) {
                            throw new Error(
                              'Failed to connect to SSE endpoint'
                            );
                          }

                          // Start processing incoming events
                          const reader = response.body.getReader();
                          const decoder = new TextDecoder('utf-8');
                          let buffer = '';

                          reader
                            .read()
                            .then(function processText({ done, value }) {
                              if (done) {
                                setStreamEnded(true);
                                return;
                              }

                              buffer += decoder.decode(value, { stream: true });

                              const parts = buffer.split('\n\n');

                              //buffer = parts[parts.length - 1];
                              handleSSE(buffer);
                              setAutoScroll(true);

                              return reader.read().then(processText);
                            });
                        })
                        .catch((error) => {
                          setStreamEnded(true);
                        });
                    };
                    startSSE();
                  } else {
                    sendMessage(message);
                    handleAutoScroll();
                  }
                }}
              />
            ))}
          {currentChatRender}
          <ChatScrollAnchor trackVisibility={autoScroll} />
        </div>
        <footer className=" w-full flex justify-center pb-6 absolute bottom-0">
          <div
            className="glass-top absolute bottom-0 pointer-events-none w-full h-[80px]  backdrop-blur-xl z-0"
            style={{
              maskImage: 'linear-gradient(transparent, black 60%)'
            }}
          ></div>
          <PlansModal
            togglePlansModal={openPricingModel}
            setTogglePlansModal={() => setOpenPricingModel(false)}
          />
          <PromptInput
            disabled={apiKey || handleDisabledForMaths ? true : false}
            streaming={!streamEnded}
            onSubmit={async (message: string) => {
              const chatWindowParams = getChatWindowParams();
              const { connectionQuery } = chatWindowParams;
              if (
                subject === 'Math' &&
                connectionQuery.topicSecondary?.trim().length === 0
              ) {
                const fetchedMessages: Array<ChatMessageType> =
                  await ApiService.getConversionById({
                    conversationId: id
                  });
                const updatedMessages = fetchedMessages
                  .sort((a, b) => a.id - b.id)
                  .map((el) => el.log);

                console.log('sorted messages are:', updatedMessages);
                const lastMessage = updatedMessages.at(-1);

                if (lastMessage.role === 'user') {
                  const d = await createMathConvoLogMutation.mutateAsync({
                    query: message,
                    studentId,
                    conversationId: id
                  });
                  updatedMessages.push(d.data.log);
                }
                const body = {
                  ...connectionQuery,
                  studentId,
                  language:
                    connectionQuery.language &&
                    connectionQuery.language.length > 0
                      ? connectionQuery.language
                      : 'English',
                  firebaseId: user.firebaseId,
                  conversationId: id,
                  name: user.name.first,
                  query: message,
                  messages: JSON.stringify(updatedMessages)
                };
                setStreamEnded(false);
                const q = encodeQueryParams(body);
                sendMessage(message, 'math');
                handleAutoScroll();
                const startSSE = () => {
                  // Make a GET request to the SSE endpoint
                  fetch(`${process.env.REACT_APP_AI_II}/solve/${q}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'text/event-stream',
                      'Cache-Control': 'no-cache',
                      Connection: 'keep-alive',
                      'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
                    }
                  })
                    .then((response) => {
                      // Check if the response is OK, before continuing
                      if (!response.ok) {
                        throw new Error('Failed to connect to SSE endpoint');
                      }

                      // Start processing incoming events
                      const reader = response.body.getReader();
                      const decoder = new TextDecoder('utf-8');
                      let buffer = '';

                      reader.read().then(function processText({ done, value }) {
                        if (done) {
                          setStreamEnded(true);
                          return;
                        }

                        buffer += decoder.decode(value, { stream: true });

                        const parts = buffer.split('\n\n');

                        //buffer = parts[parts.length - 1];
                        handleSSE(buffer);
                        setAutoScroll(true);

                        return reader.read().then(processText);
                      });
                    })
                    .catch((error) => {
                      setStreamEnded(true);
                    });
                };
                startSSE();
              } else {
                sendMessage(message);
                handleAutoScroll();
              }
            }}
            conversationId={id}
            onClick={() => {
              if (apiKey && !studentId) setOpenPricingModel(true);
            }}
          />
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
