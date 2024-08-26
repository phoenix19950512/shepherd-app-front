import CustomChatLoader from '../../../components/CustomComponents/CustomChatLoader';
import CustomSideModal from '../../../components/CustomComponents/CustomSideModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import useIsMobile from '../../../helpers/useIsMobile';
import useDebounce from '../../../hooks/useDebounce';
import useTimer from '../../../hooks/useTimer';
import {
  chatHistory, // chatWithDoc,
  deleteGeneratedSummary,
  generateSummary,
  getPDFHighlight,
  getToggleReaction, // postGenerateSummary,
  postPinnedPrompt,
  updateGeneratedSummary
} from '../../../services/AI';
import ApiService from '../../../services/ApiService';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import {
  NoteData,
  NoteDetails,
  NoteServerResponse,
  NoteStatus
} from '../../../types';
import DocViewer from './DocViewer';
import Chat from './chat';
import {
  Header,
  FirstSection,
  StyledEditorWrapper,
  StyledEditorContainer,
  StyledEditor,
  StyledChatWrapper,
  StyledButton
} from './styles';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import clsx from 'clsx';
import { CLEAR_EDITOR_COMMAND, LexicalEditor as EditorType } from 'lexical';
import { isEmpty, isNil, isString, truncate } from 'lodash';
import moment from 'moment';
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef
} from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import noteStore from '../../../state/noteStore';
import { RiLockFill, RiLockUnlockFill } from 'react-icons/ri';
import PlansModal from '../../../components/PlansModal';
import {
  Box,
  Text,
  Center,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link
} from '@chakra-ui/react';
import { languages } from '../../../helpers';

export default function DocChat() {
  const toastIdRef = useRef<any>();
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useDebounce(500, 10);
  const [editor] = useLexicalComposerContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { user }: any = userStore();
  const toast = useToast();

  const [isHovering, setIsHovering] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');

  const handleLockClick = () => {
    setTogglePlansModal(true);
  };
  //no longer worried about paywalling this for now, we have a freemmium tier
  // useEffect(() => {
  //   console.log("hasActiveSubscription", hasActiveSubscription)
  //   if (!hasActiveSubscription && user) {
  //     // Set messages and show the modal if the user has no active subscription
  //     setPlansModalMessage(
  //       !user.hadSubscription
  //         ? 'Start Your Subscription!'
  //         : 'Pick a plan to access your AI Study Tools! 🚀'
  //     );
  //     setPlansModalSubMessage('One-click Cancel at anytime.');
  //     setTogglePlansModal(true)
  //   } else if (!user) {
  //     setPlansModalMessage('Start Your Subscription!');
  //     setPlansModalSubMessage('One-click Cancel at anytime.');
  //     setTogglePlansModal(true)
  //   }
  // }, [user, hasActiveSubscription]);

  const [llmResponse, setLLMResponse] = useState('');
  const [readyToChat, setReadyToChat] = useState(false);
  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);
  const [canStartSaving, setCanStartSaving] = useState(false);
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );

  const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
    return moment(date).format(format);
  };
  // const [chatWidth, setChatWidth] = useState(0);

  const [messages, setMessages] = useState<
    {
      text: string;
      isUser: boolean;
      isLoading: boolean;
      dislike: boolean;
      like: boolean;
      chatId?: number;
      isPinned?: boolean;
      createdAt?: string;
    }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const apiKey = searchParams.get('apiKey');
  const documentId = searchParams.get('documentId')
    ? decodeURIComponent(searchParams.get('documentId'))
    : '';
  const documentUrl = searchParams.get('documentUrl')
    ? decodeURIComponent(searchParams.get('documentUrl'))
    : '';
  const language = searchParams.get('language')
    ? decodeURIComponent(searchParams.get('language'))
    : 'English';

  const noteId: string = searchParams.get('noteId')
    ? decodeURIComponent(searchParams.get('noteId'))
    : '';
  const docKeywordsEncoded = searchParams.get('docKeywords');
  const docKeywords = docKeywordsEncoded
    ? docKeywordsEncoded.split(',').map((item) => decodeURIComponent(item))
    : [];
  // const [keyword, setKeyword] = useState('');
  const title = searchParams.get('docTitle')
    ? decodeURIComponent(searchParams.get('docTitle'))
    : '';
  const directStudentId = user?.student?._id;
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hightlightedText, setHightlightedText] = useState<any[]>([]);
  const [selectedHighlightArea, setSelectedHighlightArea] = useState<any>({});
  const [isUpdatedSummary, setUpdatedSummary] = useState<boolean>(false);
  const content = location.state?.content ?? '';
  const [initialContent, setInitialContent] = useState<any>(content);
  const [editedTitle, setEditedTitle] = useState('');
  const [toggleMobileChat, setToggleMobileChat] = useState(false);
  const [summaryStart, setSummaryStart] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const studentId = useMemo(() => {
    const hasSid = Boolean(searchParams.get('sid'));
    if (hasSid) {
      const studentParamsId = decodeURIComponent(searchParams.get('sid'));
      return studentParamsId;
    }
    return user?._id;
  }, [user]);

  const mobile = useIsMobile({
    defaultWidth: 1024
  });
  const [_, setSwitchDocument] = useState(true);
  const [likesDislikes, setLikesDislikes] = useState(
    new Array(messages.length).fill({
      like: false,
      dislike: false
    })
  );
  const [isPinned, setIsPinned] = useState(
    new Array(messages.length).fill({
      isPinned: false
    })
  );

  const [chatId, setChatId] = useState('');
  const [selectedChatId, setSelectedChatId] = useState('');
  const [chatHistoryId, setChatHistoryId] = useState('');
  // const [isChatLoading, setChatLoading] = useState({});
  const [pinnedResponse, setPinnedResponse] = useState<any>();

  const [currentTime, setCurrentTime] = useState<string>(
    formatDate(new Date())
  );

  const [isChatLoading, setChatLoading] = useState({});
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [pinPromptArr, setPinPromptArr] = useState<any>();
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [callTimerCallback, setCallTimerCallback] = useState(false);

  const { fetchSingleNote, note, updateNote: updateNoteSummary } = noteStore();
  const [noteLoading, setNoteLoading] = useState(false);
  const [docchatLimitReached, setDocchatLimit] = useState(false);

  const isLike = useMemo(() => {
    return likesDislikes[1]?.like
      ? true
      : false || likesDislikes[1]?.dislike
      ? false
      : true;
  }, [likesDislikes]);

  const handleToggleMobileChat = () => setToggleMobileChat(!toggleMobileChat);

  function handleCloseToast() {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  }
  function handleCloseAllToast() {
    // you may optionally pass an object of positions to exclusively close
    // keeping other positions opened
    // e.g. `{ positions: ['bottom'] }`
    toast.closeAll();
  }

  function handleAddToast(currentToast = toast({ description: 'some text' })) {
    toastIdRef.current = currentToast;
  }

  const handleDislike = (index) => {
    setLikesDislikes((prev) => {
      const newState = [...prev];
      newState[index] = { dislike: !prev[index]?.dislike, like: false };
      return newState;
    });
  };

  const handleLike = (index) => {
    setLikesDislikes((prev) => {
      const newState = [...prev];
      newState[index] = { like: !prev[index]?.like, dislike: false };
      return newState;
    });
  };

  const updateNote = async (
    id: string,
    data: NoteData
  ): Promise<NoteServerResponse | null> => {
    const resp = await ApiService.updateNote(id, data);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

  const handlePinPrompt = async ({
    chatHistoryId = '',
    studentId = '',
    value = false
  }) => {
    setChatLoading((prevChatLoadingState) => ({
      ...prevChatLoadingState,
      [chatHistoryId]: true // Set loading state for the specific chat icon
    }));

    try {
      const response = await postPinnedPrompt({
        chatId: chatHistoryId,
        studentId
      });

      if (response) {
        setChatLoading((prevChatLoadingState) => ({
          ...prevChatLoadingState,
          [chatHistoryId]: false // Set loading state for the specific chat icon
        }));

        setPinnedResponse(response);
        // You might want to toast a success message or handle the success response
        handleCloseToast();
        setTimeout(() => {
          handleAddToast(
            toast({
              render: () => (
                <CustomToast
                  title={
                    value
                      ? 'Chat prompt pinned successfully!'
                      : 'Chat prompt unpinned successfully!'
                  }
                  status="success"
                />
              ),
              position: 'top-right',
              isClosable: true
            })
          );
        }, 100);
        // toast({
        //   render: () => (
        //     <CustomToast
        //       title="Chat prompt pinned successfully!"
        //       status="success"
        //     />
        //   ),
        //   position: 'top-right',
        //   isClosable: true
        // });
      } else {
        setChatLoading((prevChatLoadingState) => ({
          ...prevChatLoadingState,
          [chatHistoryId]: false // Set loading state for the specific chat icon
        }));

        handleCloseToast();
        setTimeout(() => {
          handleAddToast(
            toast({
              title: 'Failed to pin chat prompt',
              description: 'No response received from the server.',
              status: 'warning',
              duration: 5000,
              isClosable: true
            })
          );
        }, 100);
      }
    } catch (error) {
      setChatLoading((prevChatLoadingState) => ({
        ...prevChatLoadingState,
        [chatHistoryId]: false // Set loading state for the specific chat icon
      }));

      // Handle errors here
      handleCloseToast();
      setTimeout(() => {
        handleAddToast(
          toast({
            title: 'An error occurred',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        );
      }, 100);
    }
  };

  const handleAutoSave = (editor: EditorType) => {
    // use debounce filter
    // TODO: we must move this to web worker
    // additional condition for use to save note details

    // const saveLocalCallback = (noteId: string, note: string) => {
    //   saveNoteLocal(getLocalStorageNoteId(noteId), note);
    // };
    // evaluate other conditions to true or false
    const saveCondition = () => !editor.getEditorState().isEmpty();
    // note save callback wrapper
    const saveCallback = () => {
      autoSaveNote(editor, () => {
        handleRefreshNote();
        handleCloseToast();

        setTimeout(() => {
          handleAddToast(
            toast({
              render: () => (
                <CustomToast title="Note Refreshing....." status="success" />
              ),
              position: 'top-right',
              isClosable: true
            })
          );
        });
      });
    };
    debounce(saveCallback, saveCondition);
  };

  /**
   * Auto-save note contents
   *
   * @returns
   */
  const autoSaveNote = async (
    editor: EditorType,
    saveCallback?: (noteId?: string, note?: string) => any
  ) => {
    if (!editor) return;
    if (editor.getEditorState().isEmpty()) return;

    let noteJSON = '';
    let noteStatus: NoteStatus;

    try {
      const editorJson = editor?.getEditorState().toJSON();
      noteJSON = JSON.stringify(editorJson);
    } catch (error: any) {
      return;
    }

    if (!isEmpty(noteId)) {
      setIsSavingNote(true);
      noteStatus = NoteStatus.SAVED;

      const data: {
        note: string;
        status: string;
        topic: string;
      } = {
        note: noteJSON,
        status: noteStatus,
        topic: editedTitle
      };

      if (!isNil(data.topic) || !isEmpty(data.topic)) {
        const result = await updateNote(noteId, data as NoteData);
        setCurrentTime(formatDate(result?.data.updatedAt));
        saveCallback && saveCallback();
      }

      setIsSavingNote(false);
    }
  };
  useEffect(() => {
    if (!user && !apiKey) {
      navigate('/signup');
    }
    if (apiKey) {
      editor.setEditable(false);
      const inputElements = document.querySelectorAll('textarea');

      // Disable each input element on the page
      inputElements.forEach((input) => {
        input.disabled = true;
      });
      window.addEventListener('click', () => {
        setTogglePlansModal(true);
      });
    }
  }, [user, apiKey, navigate, editor]);
  useEffect(() => {
    if (!isEmpty(studentId)) {
      let authSocket: Socket<any, any> | null = null;
      if (documentId) {
        authSocket = socketWithAuth({
          studentId,
          documentId,
          firebaseId: user?.firebaseId,
          language: language as (typeof languages)[number],
          namespace: 'doc-chat',
          name: user?.name.first
        }).connect();

        // setSocket(authSocket);
      }

      if (!isEmpty(noteId)) {
        authSocket = socketWithAuth({
          studentId,
          noteId,
          language: language as (typeof languages)[number],
          namespace: 'note-workspace',
          name: user?.name.first,
          isDevelopment: process.env.REACT_APP_API_ENDPOINT.includes('develop')
          // isDevelopment: false
        }).connect();

        // setSocket(authSocket);
      }

      setSocket(authSocket);
    }
  }, [studentId, documentId, noteId]);

  useEffect(() => {
    if (socket) {
      socket.on('new_note_summary', (data) => {
        if (!isEmpty(editedTitle)) {
          const summary = data.summary;
          updateNoteSummary(noteId, { topic: editedTitle, summary });
          setSummaryText(summary);
        }
      });
    } else {
      setNoteLoading(true);

      // return () => socket.off('new_note_summary', () => setNoteLoading(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, editedTitle]);

  useEffect(() => {
    if (socket) {
      socket.on('current_conversation', (conversationId) => {
        setReadyToChat(true);
      });

      return () => socket.off('current_conversation');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
      });

      return () => socket.off('ready');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('docchat_limit_reached', (limitReached) => {
        setDocchatLimit(limitReached);
        // onOpen();
      });
      return () => socket.off('docchat_limit_reached');
    }
  }, [socket]);

  useEffect(() => {
    if (docchatLimitReached) {
      onOpen();
    }
  }, [docchatLimitReached, onOpen]);

  useEffect(() => {
    if (socket) {
      socket.on('refresh_status', (refreshStatus) => {
        if (refreshStatus.status === 'REFRESH_DONE') {
          setTimeout(() => {
            handleCloseAllToast();
            handleAddToast(
              toast({
                render: () => (
                  <CustomToast
                    title="Note Refresh successful!"
                    status="success"
                  />
                ),
                position: 'top-right',
                isClosable: true
              })
            );
          }, 1500);
        }
      });

      return () => {
        socket.off('refresh_status');
        // socket.off('refresh_note');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('error', () => {
        toast({
          render: () => <CustomToast title="Note Error" status="error" />,
          position: 'top-right',
          isClosable: true
        });
      });

      return () => {
        socket.off('error');
        // socket.off('refresh_note');
      };
    }
  }, [socket]);

  const handleRefreshNote = () => {
    socket.emit('refresh_note');
  };

  useEffect(() => {
    if (socket) {
      socket.on('chat response end', (completeText) => {
        setLLMResponse('');
        setTimeout(
          () => setBotStatus('Philosopher, thinker, study companion.'),
          1000
        );
        // eslint-disable-next-line
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: completeText,
            isUser: false,
            isLoading: false,
            dislike: false,
            like: false
          }
        ]);
      });

      return () => socket.off('chat response end');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response start', async (token) => {
        setBotStatus('Typing...');

        setLLMResponse((llmResponse) => llmResponse + token);
      });

      return () => socket.off('chat response start');
    }
  }, [socket]);

  useEffect(() => {
    if (!summaryStart || !socket) return;

    const handleSummaryStart = (token) => {
      if (token) {
        setSummaryText((prevSummary) => prevSummary + token);
      }
    };

    socket.on('summary start', handleSummaryStart);

    // Cleanup listener when the component is unmounted or when dependencies change
    return () => socket.off('summary start', handleSummaryStart);
  }, [summaryStart, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('summary end', async () => {
        setSummaryLoading(false);
      });

      return () => socket.off('summary end');
    }
  }, [socket]);

  useEffect(() => {
    const summaryNeeded =
      socket && readyToChat && chatHistoryLoaded && !messages?.length;
    if (summaryNeeded) {
      socket.emit('generate summary');
    }
  }, [readyToChat, socket, messages?.length, chatHistoryLoaded]);

  useEffect(() => {
    if (socket) {
      socket.on('summary_generation_error', async (data) => {
        setSummaryError(true);
        showToast(data.title, data.status);
      });

      return () => socket.off('summary_generation_error');
    }
  }, [socket]);

  useEffect(() => {
    if (summaryError) {
      socket.emit('summary_generation_error', {
        title:
          'Unable to process your request at this time. Please try again later.',
        status: 'error'
      });
    }
  }, [summaryError]);

  useEffect(() => {
    if (isEmpty(chatId) || isNil(chatId)) return;
    const response = async () => {
      await getToggleReaction({
        chatId,
        reactionType: isLike ? 'like' : 'dislike'
      }).catch((err) => {
        // console.error(err);
      });
    };
    response();
  }, [getToggleReaction, chatId, isLike, likesDislikes]);

  // useEffect(() => {
  //   if (isEmpty(documentId)) {
  //     return;
  //   }
  //   if (isEmpty(studentId)) {
  //     return;
  //   }

  //   if (isEmpty(noteId)) {
  //     return;
  //   }

  //   const fetchSummary = async () => {
  //     console.log('notedId =>', noteId);
  //     const { summary } = await generateSummary({
  //       documentId: documentId || noteId,
  //       studentId
  //     });
  //     setSummaryText(summary);
  //   };
  //   fetchSummary();
  // }, [documentId, studentId, noteId]);

  useEffect(() => {
    const fetchSummary = async () => {
      setSummaryText('');

      try {
        if (!documentId) {
          // console.log('Document ID is missing');
          return;
        }

        // API call to generate summary
        const response = await generateSummary({
          documentId: documentId,
          studentId
        });

        if (response && response.summary) {
          setSummaryText(response.summary);
        }
      } catch (error) {
        // console.error('Error fetching summary:', error);
        // Handle or log error appropriately
      }
    };

    // Invoke the fetch function
    fetchSummary();
  }, [documentId, studentId]);

  useEffect(() => {
    if (noteLoading) {
      fetchSingleNote(noteId);
    }
  }, [noteLoading, fetchSingleNote]);

  // useEffect(() => {
  //   const data = {
  //     studentId
  //   };

  //   if (!isEmpty(documentId) && !isNil(documentId)) {
  //     data['documentId'] = documentId;
  //   }
  //   if (!isEmpty(noteId) && !isNil(noteId)) {
  //     data['noteId'] = noteId;
  //   }

  //   const fetchChatHistory = async () => {
  //     try {
  //       const historyData = await chatHistory(data);

  //       const mappedData = historyData?.map((item) => ({
  //         text: item?.log.content,
  //         isUser: item?.log.role === 'user',
  //         isLoading: false,
  //         disliked: item?.disliked,
  //         liked: item?.liked,
  //         chatId: item?.id,
  //         isPinned: item?.isPinned,
  //         createdAt: new Date(item?.createdAt) || new Date(0)
  //       }));

  //       const sortedMessages = mappedData?.sort(
  //         (a, b) => a.createdAt - b.createdAt
  //       );

  //       setMessages(sortedMessages);
  //       // Set likesDislikes based on the fetched chat history
  //       setLikesDislikes(
  //         mappedData.map((message) => ({
  //           like: message.liked,
  //           dislike: message.disliked
  //         }))
  //       );

  //       setIsPinned(
  //         mappedData.map((message) => ({
  //           isPinned: message.isPinned
  //         }))
  //       );

  //       setPinPromptArr(mappedData?.filter((message) => message.isPinned));

  //       setChatHistoryLoaded(true);
  //     } catch (error) {
  //       toast({
  //         render: () => (
  //           <CustomToast
  //             title="Failed to fetch chat history..."
  //             status="error"
  //           />
  //         ),
  //         position: 'top-right',
  //         isClosable: true
  //       });
  //     }
  //   };

  //   fetchChatHistory();
  // }, [documentId, studentId]);

  useEffect(() => {
    const data = {
      studentId
    };

    if (!isEmpty(documentId) && !isNil(documentId)) {
      data['documentId'] = documentId;
    }
    if (!isEmpty(noteId) && !isNil(noteId)) {
      data['noteId'] = noteId;
    }

    const fetchChatHistory = async () => {
      try {
        const historyData = await chatHistory(data);

        const mappedData = historyData?.map((item) => ({
          text: item?.log.content,
          isUser: item?.log.role === 'user',
          isLoading: false,
          disliked: item?.disliked,
          liked: item?.liked,
          chatId: item?.id,
          isPinned: item?.isPinned,
          createdAt: new Date(item?.createdAt) || new Date(0)
        }));

        // Updated sorting logic
        const sortedMessages = mappedData?.sort((a, b) => {
          const dateDiff = a.createdAt - b.createdAt;
          if (dateDiff === 0) {
            return a.chatId - b.chatId;
          }
          return dateDiff;
        });

        setMessages(sortedMessages);
        // Set likesDislikes based on the fetched chat history
        setLikesDislikes(
          mappedData.map((message) => ({
            like: message.liked,
            dislike: message.disliked
          }))
        );

        setIsPinned(
          mappedData.map((message) => ({
            isPinned: message.isPinned
          }))
        );

        setPinPromptArr(mappedData?.filter((message) => message.isPinned));

        setChatHistoryLoaded(true);
      } catch (error) {
        toast({
          render: () => (
            <CustomToast
              title="Failed to fetch chat history..."
              status="error"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
      }
    };

    fetchChatHistory();
  }, [documentId, studentId]);

  useEffect(() => setShowPrompt(!!messages?.length), [messages?.length]);

  useEffect(() => {
    setSummaryText('');

    if (note?.data?.summary) {
      setSummaryText(note?.data?.summary);
    }
  }, [noteId, note?.data?.summary]);

  useEffect(() => {
    if (isEmpty(documentId)) {
      return;
    }
    const getHighlight = async () => {
      setLoading(true);
      const response = await getPDFHighlight({ documentId });
      setHightlightedText(response);
      setLoading(false);
    };
    getHighlight();
  }, [documentId]);

  useEffect(() => {
    if (!location.state?.documentUrl && !location.state?.docTitle) {
      // navigate('/dashboard/notes')
    }
  }, [navigate, location.state?.documentUrl, location.state?.docTitle]);

  useEffect(() => {
    if (summaryStart) {
      setSummaryLoading(true);
    } else {
      setSummaryLoading(false);
    }
  }, [summaryStart]);

  const getNoteById = async (paramsIdForNote = noteId, callback = null) => {
    if (isEmpty(paramsIdForNote) || isNil(paramsIdForNote)) {
      return;
    }
    if (apiKey) {
      const resp = await ApiService.getNoteForAPIKey(
        paramsIdForNote as string,
        apiKey
      );

      const respText = await resp.text();
      try {
        const respDetails: NoteServerResponse<{ data: NoteDetails }> =
          JSON.parse(respText);

        const emptyRespDetails =
          isEmpty(respDetails) ||
          isNil(respDetails) ||
          isEmpty(respDetails.data) ||
          isNil(respDetails.data);
        if (respDetails.error || emptyRespDetails) {
          return;
        }
        if (!isEmpty(respDetails.data) && !isNil(respDetails.data)) {
          setIsLoadingNote(false);
          const { data: note } = respDetails.data;

          setEditedTitle(note.topic);

          if (!isEmpty(note?.updatedAt) && !isNil(note?.updatedAt)) {
            setCurrentTime(formatDate(note?.updatedAt));
          }
          if (!isEmpty(note.note) && !isNil(note.note)) {
            setInitialContent(note.note);
          }
          if (typeof callback === 'function') {
            callback();
          }
        }
        // set note data
      } catch (error: any) {
        return;
      }
    } else {
      const resp = await ApiService.getNote(paramsIdForNote as string);

      const respText = await resp.text();
      try {
        const respDetails: NoteServerResponse<{ data: NoteDetails }> =
          JSON.parse(respText);

        const emptyRespDetails =
          isEmpty(respDetails) ||
          isNil(respDetails) ||
          isEmpty(respDetails.data) ||
          isNil(respDetails.data);
        if (respDetails.error || emptyRespDetails) {
          return;
        }
        if (!isEmpty(respDetails.data) && !isNil(respDetails.data)) {
          setIsLoadingNote(false);
          const { data: note } = respDetails.data;

          setEditedTitle(note.topic);

          if (!isEmpty(note?.updatedAt) && !isNil(note?.updatedAt)) {
            setCurrentTime(formatDate(note?.updatedAt));
          }
          if (!isEmpty(note.note) && !isNil(note.note)) {
            setInitialContent(note.note);
          }
          if (typeof callback === 'function') {
            callback();
          }
        }
        // set note data
      } catch (error: any) {
        return;
      }
    }
  };

  useEffect(() => {
    // const initialValue =
    //   '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    // const editorState = editor.parseEditorState(initialValue);
    // editor.setEditorState(editorState);
    if (
      isString(initialContent) &&
      !isEmpty(initialContent) &&
      !isNil(initialContent)
    ) {
      const editorState = editor.parseEditorState(initialContent);
      if (!editorState.isEmpty()) {
        editor.setEditorState(editorState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  useEffect(() => {
    (async () => {
      if (!isEmpty(noteId) || !isNil(noteId)) {
        await getNoteById(noteId, () => {
          setTimeout(() => {
            setCanStartSaving(true);
          });
        });
        setTimeout(() => {
          setCanStartSaving(true);
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  useEffect(() => {
    if (callTimerCallback) {
      handleAutoSave(editor);
    }
    setCallTimerCallback(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callTimerCallback]);

  const { resetTimer } = useTimer({
    sendOnce: false,
    timestamp: 2,
    timerCallback: (value) => setCallTimerCallback(value)
  });

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        resetTimer();
        // if (canStartSaving) {
        //   handleAutoSave(editor);
        // }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, canStartSaving]);

  function showToast(title: string, status: string) {
    <CustomToast title={title} status={status} />;
  }

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
  );

  const handleClickPrompt = useCallback(
    async (event: React.SyntheticEvent<HTMLDivElement>, prompt: string) => {
      event.preventDefault();

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: prompt,
          isUser: true,
          isLoading: false,
          dislike: false,
          like: false
        }
      ]);

      socket.emit('chat message', prompt);
    },
    [socket, messages?.length]
  );

  const handleSendMessage = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (inputValue.trim() === '') {
        return;
      }

      setShowPrompt(!!messages?.length);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: inputValue,
          isUser: true,
          isLoading: false,
          dislike: false,
          like: false
        }
      ]);
      setInputValue('');

      socket.emit('chat message', inputValue);
    },
    [inputValue, messages, socket]
  );

  const handleSendKeyword = useCallback(
    async (
      event: React.SyntheticEvent<HTMLSpanElement>,
      clickedKeyword: string
    ) => {
      event.preventDefault();

      const keywordText = `Tell me more about this keyword: ${clickedKeyword} in the context of this document. What is it's significance?`;

      try {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Tell me more about ${clickedKeyword} in the context of this document.`,
            isUser: true,
            isLoading: false,
            dislike: false,
            like: false
          }
        ]);
        socket.emit('chat message', keywordText);
      } catch (e) {
        // console.log('ERROR', e);
      }
    },
    [socket]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      // If the key pressed was 'Enter', and the Shift key was not also held down
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent a new line from being added to the textarea
        handleSendMessage(event);
      }
    },
    [handleSendMessage]
  );

  const handleSummary = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setSummaryStart(true);
      socket.emit('generate summary');
    },
    [socket]
  );

  const handleDeleteSummary = useCallback(async () => {
    try {
      if (isEmpty(documentId)) {
        return;
      }
      if (isEmpty(studentId)) {
        return;
      }
      if (isEmpty(noteId)) {
        return;
      }

      const data = await deleteGeneratedSummary({
        documentId,
        studentId
      });
      if (data) {
        const fetchSummary = async () => {
          const { summary } = await generateSummary({
            documentId: documentId || noteId,
            studentId
          });
          setSummaryText(summary);
          setSummaryStart(false);
        };
        fetchSummary();
      }
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            title="Unable to process your request at this time. Please try again later."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  }, [documentId, studentId, noteId]);

  const onSwitchOnMobileView = useCallback(() => {
    setSwitchDocument((prevState) => !prevState);
  }, [setSwitchDocument]);

  const handleUpdateSummary = useCallback(async () => {
    setLoading(true);
    try {
      if (isEmpty(documentId) || isNil(documentId)) {
        return;
      }
      if (isEmpty(studentId) || isNil(studentId)) {
        return;
      }
      if (isEmpty(summaryText) || isNil(summaryText)) {
        return;
      }
      const request = await updateGeneratedSummary({
        documentId: documentId || noteId,
        studentId,
        summary: summaryText
      });
      if ([200, 201].includes(request.status)) {
        setLoading(true);
        setUpdatedSummary(true);
        setSummaryStart(false);
        toast({
          title: `Summary for ${documentId} has been updated successfully`,
          position: 'top-right',
          status: 'success',
          isClosable: true
        });

        const fetchSummary = async () => {
          const { summary } = await generateSummary({
            documentId: documentId ?? noteId,
            studentId
          });
          setSummaryText(summary);
        };
        fetchSummary();
        setLoading(false);
      }
    } catch (error) {
      toast({
        render: () => (
          <CustomToast
            title="Unable to process your request at this time. Please try again later."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
      setLoading(false);
    }
  }, [documentId, studentId, summaryText, noteId]);

  useEffect(() => setShowPrompt(!!messages?.length), [messages?.length]);

  useEffect(() => {
    if (!location.state?.documentUrl && !location.state?.docTitle) {
      // navigate('/dashboard/notes')
    }
  }, [navigate, location.state?.documentUrl, location.state?.docTitle]);

  useEffect(() => {
    if (summaryStart) {
      setSummaryLoading(true);
    } else {
      setSummaryLoading(false);
    }
  }, [summaryStart]);

  const handlePinned = (index: number, message: any) => {
    setIsPinned((prev) => {
      const newState = [...prev];
      newState[index] = {
        isPinned: !prev[index]?.isPinned
      };
      return newState;
    });
    handlePinPrompt({
      chatHistoryId: String(message?.chatId),
      studentId,
      value: !isPinned[index]?.isPinned
    });
    setPinPromptArr((prevState) => {
      const chatIdToUpdate = message.chatId;
      const updatedState = [...prevState];
      const existingIndex = updatedState.findIndex(
        (item) => item.chatId === chatIdToUpdate
      );

      if (existingIndex !== -1) {
        // Update the existing entry
        updatedState[existingIndex] = {
          ...message,
          isPinned: !isPinned[index]?.isPinned
        };
      } else {
        // Add a new entry
        updatedState.push({ ...message, isPinned: !isPinned[index]?.isPinned });
      }

      return updatedState;
    });
  };

  useEffect(() => setShowPrompt(!!messages?.length), [messages?.length]);

  // useEffect(() => {
  //   const getHighlight = async () => {
  //     setLoading(true);
  //     const response = await getPDFHighlight({ documentId });
  //     setHightlightedText(response);
  //     setLoading(false);
  //   };
  //   getHighlight();
  // }, [documentId]);

  useEffect(() => {
    if (!location.state?.documentUrl && !location.state?.docTitle) {
      // navigate('/dashboard/notes')
    }
  }, [navigate, location.state?.documentUrl, location.state?.docTitle]);

  useEffect(() => {
    if (summaryStart) {
      setSummaryLoading(true);
    } else {
      setSummaryLoading(false);
    }
  }, [summaryStart]);
  // if (!hasActiveSubscription && !apiKey) {
  //   return (
  //     <Center height="100vh" width="100%">
  //       <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
  //         <Icon
  //           as={isHovering ? RiLockUnlockFill : RiLockFill}
  //           fontSize="100px"
  //           color="#fc9b65"
  //           onMouseEnter={() => setIsHovering(true)}
  //           onMouseLeave={() => setIsHovering(false)}
  //           onClick={handleLockClick}
  //           cursor="pointer"
  //         />
  //         <Text
  //           mt="20px"
  //           fontSize="20px"
  //           fontWeight="bold"
  //           color={'lightgrey'}
  //           textAlign="center"
  //         >
  //           Unlock your full potential today!
  //         </Text>
  //       </Box>
  //       {togglePlansModal && (
  //         <PlansModal
  //           togglePlansModal={togglePlansModal}
  //           setTogglePlansModal={setTogglePlansModal}
  //           message={plansModalMessage}
  //           subMessage={plansModalSubMessage}
  //         />
  //       )}
  //     </Center>
  //   );
  // } else {

  return (
    <section
      className={clsx(
        'h-screen w-screen max-h-[calc(100vh-80px)] md:max-w-[calc(100vw-250px)] relative overflow-hidden'
      )}
    >
      {user && docchatLimitReached && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Daily Chat Limit Reached</ModalHeader>
            <ModalBody padding={'8px'}>
              <Text textAlign={'center'} fontSize={'16px'}>
                Your daily chat limit has been reached. Upgrade your plan to
                continue using the chat feature now.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={() => {
                  setTogglePlansModal(true);
                  // navigate('/dashboard/account-settings');
                }}
              >
                Upgrade Plan
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <div className={clsx('h-full z-3 w-full flex items-start ', {})}>
        <div
          className={clsx(
            'flex flex-col grow w-full md:max-w-1/2 max-h-[100%]'
          )}
        >
          <>
            {documentUrl && documentUrl.length > 0 && (
              <DocViewer
                pdfLink={documentUrl}
                pdfName={title}
                documentId={documentId}
                hightlightedText={hightlightedText}
                setHightlightedText={setHightlightedText}
                selectedHighlightArea={selectedHighlightArea}
                setSelectedHighlightArea={setSelectedHighlightArea}
                setLoading={setLoading}
              />
            )}
            {noteId && noteId.length > 0 && (
              <StyledEditorWrapper
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '4px'
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    borderRadius: '24px'
                  }
                }}
                className={clsx('', ``)}
              >
                {isLoadingNote && (
                  <div className="w-full pb-5 flex flex-col justify-center items-center h-[calc(100dvh-80px)]">
                    <CustomChatLoader className="items-center mx-auto" />
                  </div>
                )}
                {!isLoadingNote && (
                  <>
                    <Header>
                      <FirstSection>
                        <div className="doc__name">
                          <>{truncate(editedTitle, { length: 50 })}</>
                        </div>
                        <div className="timestamp">
                          <p>Updated {currentTime}</p>
                        </div>
                      </FirstSection>
                    </Header>
                    <StyledEditorContainer
                      className={clsx(
                        'w-full max-h-[70vh] overflew-hidden pb-5'
                      )}
                    >
                      <StyledEditor />
                      <div className="p-8" />
                    </StyledEditorContainer>
                  </>
                )}
              </StyledEditorWrapper>
            )}
          </>
        </div>
        {togglePlansModal && (
          <PlansModal
            togglePlansModal={togglePlansModal}
            setTogglePlansModal={setTogglePlansModal}
            message={plansModalMessage}
            subMessage={plansModalSubMessage}
          />
        )}
        {true && (
          <>
            <StyledButton onClick={handleToggleMobileChat}>
              <IoChatboxEllipsesOutline className={clsx('h-6 w-6')} />
            </StyledButton>
            <StyledChatWrapper
              as={CustomSideModal}
              isOpen={toggleMobileChat}
              onClose={handleToggleMobileChat}
            >
              {toggleMobileChat && (
                <Chat
                  ref={ref}
                  documentUrl={documentUrl}
                  isShowPrompt={isShowPrompt}
                  isReadyToChat={readyToChat}
                  messages={messages}
                  llmResponse={llmResponse}
                  botStatus={botStatus}
                  handleSendMessage={handleSendMessage}
                  handleSendKeyword={handleSendKeyword}
                  handleInputChange={handleInputChange}
                  inputValue={inputValue}
                  handleKeyDown={handleKeyDown}
                  handleSummary={handleSummary}
                  summaryLoading={summaryLoading}
                  summaryText={summaryText}
                  setSummaryText={setSummaryText}
                  documentId={documentId}
                  docKeywords={docKeywords}
                  title={title}
                  handleClickPrompt={handleClickPrompt}
                  handleDeleteSummary={handleDeleteSummary}
                  handleUpdateSummary={handleUpdateSummary}
                  hightlightedText={hightlightedText}
                  setSelectedHighlightArea={setSelectedHighlightArea}
                  loading={loading}
                  isUpdatedSummary={isUpdatedSummary}
                  isDcLimitReached={docchatLimitReached}
                  directStudentId={directStudentId}
                  onSwitchOnMobileView={onSwitchOnMobileView}
                  handleDislike={handleDislike}
                  handleLike={handleLike}
                  likesDislikes={likesDislikes}
                  setChatId={setChatId}
                  handlePinPrompt={handlePinPrompt}
                  studentId={studentId}
                  selectedChatId={selectedChatId}
                  setSelectedChatId={setSelectedChatId}
                  isChatLoading={isChatLoading}
                  setChatHistoryId={setChatHistoryId}
                  handlePinned={handlePinned}
                  isPinned={isPinned}
                  noteId={noteId}
                  pinPromptArr={pinPromptArr}
                />
              )}
            </StyledChatWrapper>

            {!mobile && (
              <div
                className={clsx(
                  'hidden md:flex md:max-w-1/2 grow w-full h-full  overflow-y-auto border-l border-gray-200'
                )}
              >
                <Chat
                  ref={ref}
                  isShowPrompt={isShowPrompt}
                  isReadyToChat={readyToChat}
                  documentUrl={documentUrl}
                  messages={messages}
                  llmResponse={llmResponse}
                  botStatus={botStatus}
                  handleSendMessage={handleSendMessage}
                  handleSendKeyword={handleSendKeyword}
                  handleInputChange={handleInputChange}
                  inputValue={inputValue}
                  handleKeyDown={handleKeyDown}
                  handleSummary={handleSummary}
                  summaryLoading={summaryLoading}
                  summaryText={summaryText}
                  setSummaryText={setSummaryText}
                  documentId={documentId}
                  docKeywords={docKeywords}
                  title={title}
                  handleClickPrompt={handleClickPrompt}
                  handleDeleteSummary={handleDeleteSummary}
                  handleUpdateSummary={handleUpdateSummary}
                  hightlightedText={hightlightedText}
                  setSelectedHighlightArea={setSelectedHighlightArea}
                  loading={loading}
                  isUpdatedSummary={isUpdatedSummary}
                  isDcLimitReached={docchatLimitReached}
                  directStudentId={directStudentId}
                  onSwitchOnMobileView={onSwitchOnMobileView}
                  handleDislike={handleDislike}
                  handleLike={handleLike}
                  likesDislikes={likesDislikes}
                  setChatId={setChatId}
                  handlePinPrompt={handlePinPrompt}
                  studentId={studentId}
                  selectedChatId={selectedChatId}
                  setSelectedChatId={setSelectedChatId}
                  isChatLoading={isChatLoading}
                  setChatHistoryId={setChatHistoryId}
                  handlePinned={handlePinned}
                  isPinned={isPinned}
                  noteId={noteId}
                  pinPromptArr={pinPromptArr}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
// }
