/* eslint-disable react-hooks/exhaustive-deps */
import DeleteIcn from '../../../assets/deleteIcn.svg?react';
import EditIcn from '../../../assets/editIcn.svg?react';
import HistoryIcn from '../../../assets/historyIcon.svg?react';
import CustomButton from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import { getDateString } from '../../../helpers';
import useIsMobile from '../../../helpers/useIsMobile';
import {
  deleteConversationId,
  editConversationId,
  fetchStudentConversations
} from '../../../services/AI';
import {
  ChatHistoryBlock,
  ChatHistoryBody,
  ChatHistoryContainer,
  ChatHistoryDate,
  ChatHistoryHeader,
  HomeWorkHelpChatContainer2
} from './styles';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styled from 'styled-components';
import ShepherdSpinner from '../components/shepherd-spinner';
import { useLocation, useNavigate } from 'react-router';

import { useSearchQuery } from '../../../hooks';

const Clock = styled.div`
  width: 20px;
  height: 20px;
  padding: 5px;
  margin: 5px;
  margin-top: 0;
`;

type Chat = {
  id: string;
  message: string;
  createdDated: string;
  title: string;
  subject: string;
  topic: string;
  level: string;
};

type GroupedChat = {
  date: string;
  messages: Chat[];
};

const ChatHistory = ({
  studentId,
  setConversationId,
  conversationId,
  isSubmitted,
  setCountNeedTutor,
  localData,
  setMessages,
  setDeleteConservationModal,
  deleteConservationModal,
  setSocket,
  setVisibleButton,
  setCertainConversationId,
  messages,
  setSomeBountyOpt,
  setNewConversationId,
  isBountyModalOpen,
  setLocalData,
  setFreshConversationId,
  onChatHistory
}: {
  studentId: string;
  setConversationId: (conversationId: string) => void;
  conversationId: string;
  localData: {
    subject: string;
    topic: string;
  };
  isSubmitted?: boolean;
  setCountNeedTutor: any;
  setMessages: any;
  setDeleteConservationModal: any;
  deleteConservationModal: boolean;
  setSocket: any;
  setVisibleButton: any;
  setCertainConversationId: any;
  messages: any;
  setSomeBountyOpt: any;
  setNewConversationId: any;
  isBountyModalOpen: boolean;
  setLocalData: any;
  setFreshConversationId: any;
  onChatHistory?: () => void;
}) => {
  // const placeholder = [
  //   {ß
  //     messages: ['No conversations — yet'],
  //     date: getDateString(new Date())
  //   }
  // ];

  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateChatHistory, setUpdateChatHistory] = useState({});
  const [updatedChat, setUpdatedChat] = useState('');
  const [toggleHistoryBox, setToggleHistoryBox] = useState({});
  const [groupChatsByDateArr, setGroupChatsByDateArr] = useState<GroupedChat[]>(
    []
  );
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const search = useSearchQuery();

  const apiKey = search.get('apiKey');

  const toast = useCustomToast();
  const showSearchRef = useRef(null) as any;
  const [editConversation, setEditConversationId] = useState('');
  const [removeIndex, setRemoveIndex] = useState(0);
  const [currentStoredArr, setCurrentStoredArr] = useState<any>();
  const [hostoryTopics, setHistoryTopics] = useState<any>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMobile = useIsMobile();

  const handleClickOutside = (event) => {
    if (
      showSearchRef.current &&
      !showSearchRef.current.contains(event.target as Node)
    ) {
      setToggleHistoryBox({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchRef]);

  async function retrieveChatHistory(
    studentId: string,
    isLoader: boolean
  ): Promise<any> {
    try {
      setLoading(isLoader);
      const chatHistory = await fetchStudentConversations(studentId);

      const historyWithContent: any = chatHistory
        .filter((chat) => chat.ConversationLogs.length > 0)
        .map((convo) => {
          const message = convo.ConversationLogs.at(-1)?.log?.content || '';

          return {
            id: convo.id,
            title: convo?.title,
            topic: convo?.topic,
            subject: convo?.subject,
            level: convo?.level,
            message:
              message.length < 140
                ? message
                : message.substring(0, 139) + '...',
            createdDated: getDateString(new Date(convo.createdAt)),
            createdAt: new Date(convo.createdAt) // Add the raw timestamp for sorting
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt); // Sort using the raw timestamp

      const uniqueTopicsArray = Array.from(
        new Set(historyWithContent.map((convo) => convo.subject))
      );

      setHistoryTopics(['All', ...uniqueTopicsArray]);
      setChatHistory(historyWithContent);
      setLoading(false);

      return historyWithContent.find((h) => h.topic === localData.topic);
    } catch (e) {
      setLoading(false);
    }
  }

  const filteredHistory = useMemo(() => {
    return selectedTopic !== 'All'
      ? chatHistory.filter((convo) => convo.subject === selectedTopic)
      : chatHistory;
  }, [selectedTopic, chatHistory]);

  function groupChatsByDate(chatHistory: Chat[]): GroupedChat[] {
    return chatHistory?.reduce((groupedChats, chat) => {
      const currentGroup = groupedChats?.find(
        (group) => group.date === chat.createdDated
      );
      if (currentGroup) {
        currentGroup?.messages.push(chat);
      } else {
        groupedChats?.push({ date: chat.createdDated, messages: [chat] });
      }
      return groupedChats;
    }, [] as GroupedChat[]);
  }

  // const groupChatsByDateArr: GroupedChat[] = groupChatsByDate(chatHistory);

  const toggleMessage = (id) => {
    setToggleHistoryBox((prevState) => {
      const updatedState = { ...prevState };

      // Toggle the state of the clicked item
      updatedState[id] = !updatedState[id];

      // Close all previous items except the one clicked
      for (const key in updatedState) {
        if (key !== id) {
          updatedState[key] = false;
        }
      }

      return updatedState;
    });
  };

  const handleUpdateConversation = useCallback(async () => {
    try {
      const request = await editConversationId({
        editConversation,
        newTitle: updatedChat
      });
      if ([200, 201].includes(request.status)) {
        retrieveChatHistory(studentId, true);
        setToggleHistoryBox({});
      }
    } catch (error) {
      toast({
        title:
          'Unable to process your request at this time. Please try again later.',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
      setLoading(false);
    }
  }, [conversationId, studentId, updatedChat]);

  useEffect(() => {
    const newChatHistory: Record<string, string> = {};

    groupChatsByDateArr?.forEach((history) => {
      history.messages.forEach((message) => {
        newChatHistory[message.id] = message.title;
      });
    });
    setUpdateChatHistory(newChatHistory);
  }, [toggleHistoryBox]);

  // useEffect(() => {
  //   retrieveChatHistory(studentId);
  // }, [studentId]);

  useEffect(() => {
    if (groupChatsByDateArr.length) {
      localStorage.setItem(
        'groupChatsByDateArr',
        JSON.stringify(groupChatsByDateArr)
      );
    }
  }, [groupChatsByDateArr]);

  useEffect(() => {
    if (groupChatsByDateArr.length) {
      const storedGroup = JSON.parse(
        localStorage.getItem('groupChatsByDateArr') as any
      );
      setCurrentStoredArr(storedGroup);
    }
  }, [groupChatsByDateArr]);

  const onCloseDeleteModal = useCallback(() => {
    setDeleteConservationModal((prevState) => !prevState);
  }, [setDeleteConservationModal]);

  const handleDeleteItem = (index) => {
    const newArray = groupChatsByDateArr.filter((_, idx) => idx !== index);
    setGroupChatsByDateArr(newArray);
  };

  const onDelete = useCallback(async () => {
    setLoading(true); // Start loading state

    try {
      const response = await deleteConversationId({
        conversationId
      });

      if (response) {
        retrieveChatHistory(studentId, true);
        setDeleteConservationModal(false);
        setSocket(null);
        setMessages([]);
        setVisibleButton(true);
        setCertainConversationId('');
        localStorage.removeItem('conversationId');
        toast({
          title: 'Conversation deleted successfully',
          status: 'success',
          position: 'top-right',
          isClosable: true
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to fetch chat history...',
        status: 'error',
        position: 'top-right',
        isClosable: true
      });
    } finally {
      setLoading(false); // End loading state
    }
  }, [conversationId]);

  useEffect(() => {
    // const groupedChats =
    //   storedGroupChatsArr && JSON.parse(storedGroupChatsArr ?? '');

    // if (groupedChats) {
    //   setChatHistory(groupedChats);
    // }
    if (!apiKey) {
      retrieveChatHistory(studentId, true);
    }
  }, [studentId]);

  useEffect(() => {
    if (isSubmitted) {
      setLoading(false);
      const retrieve = async () => {
        const latestChat = await retrieveChatHistory(studentId, false);
        if (latestChat) {
          setLocalData({});
          const p = pathname.includes('homework')
            ? '/dashboard/ace-homework'
            : '/dashboard/doc-chat';
          const pname = `${p}/${latestChat.id}`;
          setTimeout(() => {
            navigate(pname);
          }, 300);
        }

        retrieve();
      };
    }
  }, [studentId, isSubmitted, messages]);

  // useEffect(() => {
  //   if (chatHistory?.length) {
  //     localStorage.setItem('groupChatsByDateArr', JSON.stringify(chatHistory));
  //   }
  // }, [chatHistory]);

  useEffect(() => {
    if (isSubmitted && studentId && messages.length === 1) {
      setLoading(false);
    }
  }, [isSubmitted, studentId, messages]);

  useEffect(() => {
    if (messages?.length) {
      if (messages.length === 1) {
        const retrieve = async () => {
          const latestChat = await retrieveChatHistory(studentId, false);
          if (latestChat) {
            setLocalData({});
            const p = pathname.includes('homework')
              ? '/dashboard/ace-homework'
              : '/dashboard/docchat';
            const pname = `${p}/${latestChat.id}`;
            setTimeout(() => {
              navigate(pname);
            }, 500);
          }
        };
        retrieve();
        return;
      }
      if (!apiKey) {
        retrieveChatHistory(studentId, false);
      }
    }
  }, [messages, studentId]);

  useEffect(() => {
    const groupedChats = groupChatsByDate(filteredHistory);

    setGroupChatsByDateArr(groupedChats ?? []);
  }, [filteredHistory]);

  // useEffect(() => {
  //   const fetchStoredConvoId = () =>
  //     localStorage.getItem('freshConversationId') as string;
  //   const storeConvoId = (id: string) =>
  //     localStorage.setItem('freshConversationId', id);

  //   const storedConvoId = fetchStoredConvoId();
  //   if (isBountyModalOpen) {
  //     const firstMessageId =
  //       groupChatsByDateArr[selectedIndex]?.messages[selectedIndex]?.id;
  //     setConversationId(firstMessageId);
  //   }
  // }, [isSubmitted, groupChatsByDateArr, isBountyModalOpen, selectedIndex]);

  return (
    <ChatHistoryContainer>
      <ChatHistoryHeader>
        <p>Chat history</p>
        <p>Clear history</p>
      </ChatHistoryHeader>
      <div
        style={{
          maxHeight: 'calc(100% - 60px)',
          overflowY: 'scroll'
        }}
      >
        <Menu>
          <p
            style={{
              fontSize: '0.875rem',
              marginBottom: '10px'
            }}
          >
            Filter history by selected subject
          </p>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            fontSize={14}
            borderRadius="40px"
            fontWeight={400}
            width={{ sm: '400px', lg: 'auto' }}
            height="36px"
            color="text.400"
          >
            {selectedTopic || 'Select a topic'}
          </MenuButton>
          <MenuList zIndex={3}>
            {hostoryTopics
              .filter(
                (topic) => topic !== null && topic !== undefined && topic !== ''
              )
              .map((topic, index) => (
                <MenuItem
                  key={index}
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
        {loading && (
          <Box
            p={5}
            textAlign="center"
            margin="0 auto"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '40vh',
              width: '24vw'
            }}
          >
            <ShepherdSpinner />
          </Box>
        )}
        {!loading && !groupChatsByDateArr?.length && (
          <div
            style={{
              fontStyle: 'italic',
              width: '100%'
            }}
          >
            <p
              style={{
                margin: '294px 128px'
              }}
            >
              No Chat History
            </p>
          </div>
        )}

        {!loading ? (
          <div>
            {groupChatsByDateArr.length > 0 &&
              groupChatsByDateArr?.map((history, index) => (
                <ChatHistoryBlock key={index}>
                  <ChatHistoryDate>{history.date}</ChatHistoryDate>
                  {history.messages.map((message, index) => (
                    <div>
                      {!toggleHistoryBox[message.id] ? (
                        <ChatHistoryBody
                          activeChat={conversationId === message.id}
                          key={message.id}
                        >
                          <Clock>
                            <HistoryIcn />
                          </Clock>
                          {toggleHistoryBox[message.id] ? (
                            <HomeWorkHelpChatContainer2
                              value={updateChatHistory[message.id]}
                              onChange={(event) => {
                                setUpdatedChat(event.target.value);
                                setUpdateChatHistory((prevChatHistory) => ({
                                  ...prevChatHistory,
                                  [message.id]: event.target.value
                                }));
                              }}
                            ></HomeWorkHelpChatContainer2>
                          ) : (
                            <p
                              onClick={() => {
                                if (
                                  pathname.includes('homework') &&
                                  message.id === conversationId
                                ) {
                                  setCountNeedTutor(1);
                                  isMobile && onChatHistory?.();
                                  localStorage.setItem(
                                    'bountyOpt',
                                    JSON.stringify({
                                      subject: message.subject,
                                      topic: message.topic,
                                      level: message.level
                                    })
                                  );
                                  setSomeBountyOpt({
                                    subject: message.subject,
                                    topic: message.topic,
                                    level: message.level
                                  });
                                  setConversationId(conversationId);
                                  return navigate(
                                    `/dashboard/ace-homework/${conversationId}`
                                  );
                                }
                                if (pathname.includes('homework')) {
                                  setCountNeedTutor(1);
                                  isMobile && onChatHistory?.();
                                  localStorage.setItem(
                                    'bountyOpt',
                                    JSON.stringify({
                                      subject: message.subject,
                                      topic: message.topic,
                                      level: message.level
                                    })
                                  );
                                  setSomeBountyOpt({
                                    subject: message.subject,
                                    topic: message.topic,
                                    level: message.level
                                  });
                                  setConversationId(message.id);
                                  return navigate(
                                    `/dashboard/ace-homework/${message.id}`
                                  );
                                }

                                setSelectedIndex(index);
                                // setConversationId(message.id);
                                retrieveChatHistory(studentId, false);
                                setCountNeedTutor(1);
                                setLoading(false);
                                setLocalData({});
                                isMobile && onChatHistory?.();
                                setFreshConversationId('');
                                localStorage.setItem(
                                  'bountyOpt',
                                  JSON.stringify({
                                    subject: message.subject,
                                    topic: message.topic,
                                    level: message.level
                                  })
                                );
                                setSomeBountyOpt({
                                  subject: message.subject,
                                  topic: message.topic,
                                  level: message.level
                                });
                              }}
                            >
                              {message.title}
                            </p>
                          )}

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'inherit'
                            }}
                          >
                            {toggleHistoryBox[message.id] ? (
                              // <EditIcn onClick={handleUpdateConversation} />
                              <p onClick={handleUpdateConversation}>Save</p>
                            ) : (
                              <EditIcn
                                onClick={() => {
                                  setEditConversationId(message.id);
                                  toggleMessage(message.id);
                                }}
                              />
                            )}
                            {/* <EditIcn onClick={handleUpdateConversation} /> */}
                            <DeleteIcn
                              onClick={() => {
                                setDeleteConservationModal(
                                  (prevState) => !prevState
                                );
                                setConversationId(message.id);
                                setRemoveIndex(index);
                              }}
                            />
                          </div>
                        </ChatHistoryBody>
                      ) : (
                        <ChatHistoryBody key={message.id} ref={showSearchRef}>
                          <Clock>
                            <HistoryIcn />
                          </Clock>
                          <HomeWorkHelpChatContainer2
                            value={updateChatHistory[message.id]}
                            onChange={(event) => {
                              setUpdatedChat(event.target.value);
                              setUpdateChatHistory((prevChatHistory) => ({
                                ...prevChatHistory,
                                [message.id]: event.target.value
                              }));
                            }}
                          ></HomeWorkHelpChatContainer2>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'inherit'
                            }}
                          >
                            <p onClick={handleUpdateConversation}>Save</p>

                            {/* <EditIcn onClick={handleUpdateConversation} /> */}
                            <DeleteIcn
                              onClick={() => {
                                setDeleteConservationModal(
                                  (prevState) => !prevState
                                );
                                setConversationId(message.id);
                                setRemoveIndex(index);
                              }}
                            />
                          </div>
                        </ChatHistoryBody>
                      )}
                    </div>
                  ))}
                </ChatHistoryBlock>
              ))}
          </div>
        ) : null}
      </div>

      <CustomModal
        modalTitle=""
        isModalCloseButton
        onClose={() => setDeleteConservationModal(false)}
        isOpen={deleteConservationModal}
        modalSize="md"
        style={{ height: '260px', maxWidth: '30%' }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomButton
              type="button"
              isCancel
              onClick={onCloseDeleteModal}
              title="Cancel"
            />
            <CustomButton type="button" onClick={onDelete} title="Confirm" />
          </div>
        }
      >
        <div
          style={{
            width: '100%'
          }}
        >
          <div
            style={{
              marginTop: '65px'
            }}
          >
            <p
              style={{
                fontSize: '1.2rem',
                color: 'black',
                textAlign: 'center',
                marginBottom: '20px',
                fontWeight: '800'
              }}
            >
              Delete conversation
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                textAlign: 'center'
              }}
            >
              Are you sure you want to delete this conversation?
            </p>
          </div>
          <div></div>
        </div>
      </CustomModal>
    </ChatHistoryContainer>
  );
};

export default ChatHistory;
