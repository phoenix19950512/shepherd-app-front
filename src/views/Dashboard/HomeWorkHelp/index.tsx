/* eslint-disable react-hooks/exhaustive-deps */
import Sally from '../../../assets/saly.svg';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomSideModal from '../../../components/CustomComponents/CustomSideModal';
import CustomToast from '../../../components/CustomComponents/CustomToast/index';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import PaymentDialog, {
  PaymentDialogRef
} from '../../../components/PaymentDialog';
import { SHALL_WE_BEGIN } from '../../../helpers/constants';
import {
  chatHomeworkHelp,
  editConversationId,
  getConversionById,
  getConversionByIdAndAPIKey,
  getDescriptionById,
  updateGeneratedSummary
} from '../../../services/AI';
import { chatHistory } from '../../../services/AI';
import ApiService from '../../../services/ApiService';
import socketWithAuth from '../../../socket';
import userStore from '../../../state/userStore';
import theme from '../../../theme';
import { FlashcardData } from '../../../types';
import Chat from '../DocChat/chat';
import ChatHistory from '../DocChat/chatHistory';
import BountyOfferModal from '../components/BountyOfferModal';
import ViewHomeWorkHelpDetails from './ViewHomeWorkHelpDetails';
import ViewTutors from './ViewTutors';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer,
  MobileHomeWorkHelpHistoryContainer
} from './style';
import {
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Icon
} from '@chakra-ui/react';
import { loadStripe } from '@stripe/stripe-js';
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef
} from 'react';
import { MdInfo } from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { RiLockFill, RiLockUnlockFill } from 'react-icons/ri';
import PlansModal from '../../../components/PlansModal';
import { useSearchQuery } from '../../../hooks';
import { firebaseAuth } from '../../../firebase';

const HomeWorkHelp = () => {
  const [isOpenModal, setOpenModal] = useState(false);
  // Prompt value
  const [inputValue, setInputValue] = useState('');
  // Prompt value
  const toast = useCustomToast();
  const search = useSearchQuery();
  const shareable = search.get('shareable');
  const apiKey = search.get('apiKey');
  const newQ = search.get('new');
  const planSubject = search.get('subject');
  const planTopic = search.get('topic');
  const location = useLocation();
  const [isShowPrompt, setShowPrompt] = useState<boolean>(false);
  const [openAceHomework, setAceHomeWork] = useState(false);
  const { user }: any = userStore();
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean; isLoading: boolean }[]
  >([]);
  const [llmResponse, setLLMResponse] = useState('');
  const [readyToChat, setReadyToChat] = useState(false);
  const [botStatus, setBotStatus] = useState(
    'Philosopher, thinker, study companion.'
  );

  const [studentId, setStudentId] = useState(user?._id ?? '');
  const topic = location?.state?.topic;
  const docId = location?.state?.documentId;
  const { id: convoId } = useParams();
  const [countNeedTutor, setCountNeedTutor] = useState<number>(1);
  const [socket, setSocket] = useState<any>(null);
  const [subjectId, setSubject] = useState<string>('');
  const [localData, setLocalData] = useState<any>({
    subject: '',
    topic: ''
  });
  const [level, setLevel] = useState<any>('');
  const navigate = useNavigate();
  const [conversationId, setConversationId] = useState('');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [onlineTutorsId, setOnlineTutorsId] = useState([]);
  const [visibleButton, setVisibleButton] = useState(true);
  const storedConvoId = localStorage.getItem('conversationId');
  const [deleteConservationModal, setDeleteConservationModal] = useState(false);
  const [recentConversationId, setRecentConverstionId] = useState(null);
  const [certainConversationId, setCertainConversationId] = useState('');
  const bountyOption = JSON.parse(localStorage.getItem('bountyOpt') as any);
  const [someBountyOpt, setSomeBountyOpt] = useState({
    subject: bountyOption?.subject,
    topic: bountyOption?.topic,
    level: bountyOption?.level
  });
  const [description, setDescription] = useState('');
  const [oldUrl, setOldUrl] = useState('');
  const paymentDialogRef = useRef<PaymentDialogRef>(null);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);
  const authSocketConnected = '';
  const {
    isOpen: isBountyModalOpen,
    onOpen: openBountyModal,
    onClose: closeBountyModal
  } = useDisclosure();
  const storedGroupChatsArr = JSON.parse(
    localStorage.getItem('groupChatsByDateArr') as any
  );
  const [freshConversationId, setFreshConversationId] = useState('');
  const [newConversationId, setNewConversationId] = useState('');
  const [isChatHistory, setChatHistory] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const [documentId, setDocumentId] = useState<string>('');

  const [isHovering, setIsHovering] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [aitutorchatLimitReached, setAitutorchatLimit] = useState(false);

  const [isLimitModalOpen, setisLimitModalOpen] = useState(false);

  const { hasActiveSubscription } = userStore.getState();

  const handleLockClick = () => {
    setTogglePlansModal(true);
  };
  useEffect(() => {
    if (user) {
      setStudentId(user._id);
    }
  }, [user]);

  // useEffect(() => {
  //   if (!hasActiveSubscription && user) {
  //     // Set messages and show the modal if the user has no active subscription
  //     setPlansModalMessage(
  //       !user.hadSubscription
  //         ? 'Start Your Free Trial!'
  //         : 'Pick a plan to access your AI Study Tools! 🚀'
  //     );
  //     setPlansModalSubMessage('One-click Cancel at anytime.');
  //   } else if (!user) {
  //     setPlansModalMessage('Start Your Free Trial!');
  //     setPlansModalSubMessage('One-click Cancel at anytime.');
  //   }
  // }, [user, hasActiveSubscription]);

  useEffect(() => {
    if (planSubject && planTopic) {
      setLocalData({ subject: planSubject, topic: planTopic });
      setIsSubmitted(true);
    }
  }, [planSubject, planTopic]);

  useEffect(() => {
    if (certainConversationId || conversationId) {
      const authSocket = socketWithAuth({
        studentId,
        firebaseId: user?.firebaseId,
        topic: localData.topic,
        subject: localData.subject,
        // level: level.label,
        namespace: 'homework-help',
        name: user?.name.first,
        conversationId:
          conversationId ??
          certainConversationId ??
          storedConvoId ??
          freshConversationId
      }).connect();
      setSocket(authSocket);
    }
  }, [certainConversationId, freshConversationId, conversationId]);

  // 1st Step to initiate the chat - after selecting the subject and topic
  useEffect(() => {
    if (isSubmitted) {
      const authSocket = socketWithAuth({
        studentId,
        firebaseId: user?.firebaseId,
        topic: localData.topic,
        subject: localData.subject,
        documentId: documentId,
        // level: level.label,
        // conversationId,
        namespace: 'homework-help',
        name: user?.name.first
      }).connect();

      setSocket(authSocket);
    }
    return () => setIsSubmitted(false);
  }, [isSubmitted]);

  // 2nd Step to initiate the chat - after selecting the subject and topic
  useEffect(() => {
    if (socket && !messages.length) {
      socket.on('ready', (ready) => {
        setReadyToChat(ready);
        if (!messages.length) {
          socket.emit('chat message', SHALL_WE_BEGIN);
        }
      });
      return () => socket.off('ready');
    }
  }, [messages, socket]);

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
          { text: completeText, isUser: false, isLoading: false }
        ]);
      });

      return () => socket.off('chat response end');
    }
  }, [socket]);
  useEffect(() => {
    if (newQ) {
      setAceHomeWork(true);
    }
  }, [newQ]);

  useEffect(() => {
    if (socket) {
      socket.on('chat response start', async (token: string) => {
        setBotStatus('Typing...');
        setLLMResponse((llmResponse) => llmResponse + token);
      });

      return () => socket.off('chat response end');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('aitutorchat_limit_reached', (limitReached) => {
        setAitutorchatLimit(limitReached);
        // onOpen();
      });
      return () => socket.off('aitutorchat_limit_reached');
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleAitutorChatLimitReached = (limitReached) => {
        setisLimitModalOpen(limitReached);
      };

      socket.on('aitutorchat_limit_reached', handleAitutorChatLimitReached);

      return () => {
        socket.off('aitutorchat_limit_reached', handleAitutorChatLimitReached);
      };
    }
  }, [socket]);

  useEffect(() => {
    // Return early if there's no socket or if isSubmitted is false.
    const handleNewConversation = (conversationId: string) => {
      setFreshConversationId(conversationId);
    };

    // Attach the listener since isSubmitted is true.
    if (socket) {
      socket.on('current_conversation', handleNewConversation);
    }

    // Cleanup: remove the listener when isSubmitted becomes false,
    // when the socket changes, or when the component unmounts.
    return () => {
      socket && socket.off('current_conversation', handleNewConversation);
    };
  }, [socket]);

  useEffect(() => {
    // Attach the listener since isSubmitted is true.
    if (socket && docId) {
      socket.on('append_document', {
        documentId: docId
      });
    }

    // Cleanup: remove the listener when isSubmitted becomes false,
    // when the socket changes, or when the component unmounts.
    return () => {
      socket &&
        socket.off('append_document', {
          documentId: docId
        });
    };
  }, [socket, docId]);

  useLayoutEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const historyData = await chatHistory({
          studentId
        });
        const mappedData = historyData?.map((item) => ({
          text: item.content,
          isUser: item.role === 'user',
          isLoading: false
        }));

        setMessages((prevMessages) => [...prevMessages, ...mappedData]);
      } catch (error) {
        toast({
          title: 'Failed to fetch chat history...',
          status: 'error',
          position: 'top-right',
          isClosable: true
        });
      }
    };
    if (studentId) {
      fetchChatHistory();
    }
  }, [studentId]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(event.target.value);
    },
    [setInputValue]
  );

  const handleClose = () => {
    setAceHomeWork((prevState) => !prevState);
  };

  const handleAceHomeWorkHelp = useCallback(() => {
    setAceHomeWork((prevState) => !prevState);
    if (!convoId) {
      navigate(-1);
    }
  }, [setAceHomeWork]);

  const handleAce = useCallback(() => {
    setAceHomeWork(true);
    navigate('/dashboard/ace-homework?new=true');
  }, [setAceHomeWork]);

  const onCountTutor = useCallback(
    async (message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isUser: true, isLoading: false }
      ]);

      setCountNeedTutor((prevState) => prevState + 1);

      socket.emit('chat message', message);
    },
    [setMessages, setCountNeedTutor, socket]
  );

  const handleClickPrompt = useCallback(
    async (event: React.SyntheticEvent<HTMLDivElement>, prompt: string) => {
      event.preventDefault();

      setShowPrompt(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: prompt, isUser: true, isLoading: false }
      ]);
      setInputValue('');

      socket.emit('chat message', prompt);
    },
    [socket]
  );

  const onOpenModal = useCallback(() => {
    if (user && user.paymentMethods?.length > 0) {
      openBountyModal();
    } else {
      setupPaymentMethod();
    }
  }, [user]);

  const handleSendMessage = useCallback(
    async (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (inputValue.trim() === '') {
        return;
      }

      setShowPrompt(true);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, isUser: true, isLoading: false }
      ]);
      setInputValue('');
      socket && socket.emit('chat message', inputValue);
      // setIsSubmitted(true);
    },
    [inputValue, socket]
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

  const onChatHistory = useCallback(() => {
    setChatHistory((prevState) => !prevState);
  }, [setChatHistory]);

  useEffect(() => {
    const fetchConversationId = async () => {
      setLoading(true);
      if (shareable && shareable.length > 0 && apiKey && apiKey.length > 0) {
        const response = await getConversionByIdAndAPIKey({
          conversationId:
            convoId ??
            conversationId ??
            recentConversationId ??
            freshConversationId,
          apiKey
        });

        if (response) {
          setVisibleButton(false);
        }
        const previousConvoData = response
          ?.map((conversation) => {
            // Make sure there's a createdAt attribute
            const createdAt = conversation?.createdAt || new Date(0); // Default date in case createdAt is not present

            return {
              text: conversation?.log?.content,
              isUser: conversation?.log?.role === 'user',
              isLoading: false,
              createdAt: new Date(createdAt), // Convert createdAt to a Date object
              id: conversation?.id // Assuming each conversation has a unique id
            };
          })
          .filter((convo) => convo.text !== SHALL_WE_BEGIN)
          .sort((a, b) => {
            return a.createdAt.getTime() - b.createdAt.getTime();
          });

        const countOfIDontUnderstand = previousConvoData.filter(
          (convo) => convo.text === "I don't understand"
        ).length;

        const hasContentThreeTimes = countOfIDontUnderstand >= 3;

        if (hasContentThreeTimes) {
          setCountNeedTutor((prevState) => prevState + 2);
        }

        setMessages((prevState) => [...previousConvoData]);
        setLoading(false);
        if (convoId) {
          setConversationId(convoId);
        }

        const inputElements = document.querySelectorAll('textarea');

        // Disable each input element on the page
        inputElements.forEach((input) => {
          input.disabled = true;
        });
        window.addEventListener('click', () => {
          setTogglePlansModal(true);
        });
      } else {
        const token = await firebaseAuth.currentUser?.getIdToken();

        if (!token) {
          navigate('/signup');
        }
      }
      const response = await getConversionById({
        conversationId:
          convoId ??
          conversationId ??
          recentConversationId ??
          freshConversationId
      });

      if (response) {
        setVisibleButton(false);
      }
      const previousConvoData = response
        ?.map((conversation) => {
          // Make sure there's a createdAt attribute
          const createdAt = conversation?.createdAt || new Date(0); // Default date in case createdAt is not present

          return {
            text: conversation?.log?.content,
            isUser: conversation?.log?.role === 'user',
            isLoading: false,
            createdAt: new Date(createdAt), // Convert createdAt to a Date object
            id: conversation?.id // Assuming each conversation has a unique id
          };
        })
        .filter((convo) => convo.text !== SHALL_WE_BEGIN)
        .sort((a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime();
        });

      const countOfIDontUnderstand = previousConvoData.filter(
        (convo) => convo.text === "I don't understand"
      ).length;

      const hasContentThreeTimes = countOfIDontUnderstand >= 3;

      if (hasContentThreeTimes) {
        setCountNeedTutor((prevState) => prevState + 2);
      }

      setMessages((prevState) => [...previousConvoData]);
      setLoading(false);
      if (convoId) {
        setConversationId(convoId);
      }
    };
    fetchConversationId();
    if (conversationId) {
      setShowPrompt(true);
    }
  }, [conversationId, socket, recentConversationId, convoId]);
  const fetchDescription = async (id: string) => {
    const response = await getDescriptionById({ conversationId: id });
    if (response?.data) {
      setDescription(response.data);
    }
  };

  useEffect(() => {
    const fetchDescription = async (id: string) => {
      const response = await getDescriptionById({ conversationId: id });
      if (response?.data) {
        setDescription(response.data);
      }
    };

    const effectiveConversationId = conversationId ?? freshConversationId;

    if (effectiveConversationId) {
      fetchDescription(effectiveConversationId);
    }
  }, [conversationId, freshConversationId]);

  const onRouteHomeWorkHelp = useCallback(() => {
    setIsSubmitted(true);
    setMessages([]);
    setCountNeedTutor(1);
    setInputValue('');
    handleClose();
  }, [
    subjectId,
    localData,
    level,
    setMessages,
    handleClose,
    navigate,
    socket,
    topic,
    studentId,
    localData.topic,
    setIsSubmitted
  ]);

  //Payment Method Handlers
  const url: URL = new URL(window.location.href);
  const params: URLSearchParams = url.searchParams;
  const clientSecret = params.get('setup_intent_client_secret');
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
  );

  const setupPaymentMethod = async () => {
    try {
      const paymentIntent = await ApiService.createStripeSetupPaymentIntent();

      const { data } = await paymentIntent.json();

      paymentDialogRef.current?.startPayment(
        data.clientSecret,
        `${window.location.href}`
      );
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (clientSecret) {
      (async () => {
        const stripe = await stripePromise;
        const setupIntent = await stripe?.retrieveSetupIntent(clientSecret);
        await ApiService.addPaymentMethod(
          setupIntent?.setupIntent?.payment_method as string
        );
        // await fetchUser();
        switch (setupIntent?.setupIntent?.status) {
          case 'succeeded':
            toast({
              title: 'Your payment method has been saved.',
              status: 'success',
              position: 'top',
              isClosable: true
            });
            openBountyModal();
            break;
          case 'processing':
            toast({
              title:
                "Processing payment details. We'll update you when processing is complete.",
              status: 'loading',
              position: 'top',
              isClosable: true
            });
            break;
          case 'requires_payment_method':
            toast({
              title:
                'Failed to process payment details. Please try another payment method.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
          default:
            toast({
              title: 'Something went wrong.',
              status: 'error',
              position: 'top',
              isClosable: true
            });
            break;
        }
        // setSettingUpPaymentMethod(false);
      })();
    }
    /* eslint-disable */
  }, [clientSecret]);

  useEffect(() => {
    if (isSubmitted) {
      setMessages([]);
      // setConversationId('');
      setVisibleButton(false);
      setCountNeedTutor(1);
      localStorage.removeItem('conversationId');
    }
  }, [isSubmitted]);

  useEffect(() => {
    const getOnlineTutors = async () => {
      try {
        const resp = await ApiService.getOnlineTutors();

        const response = await resp.json();
        setOnlineTutorsId(response?.data);
      } catch (error: any) {
        toast({
          title: 'Failed to fetch chat history...',
          status: 'error',
          position: 'top-right',
          isClosable: true
        });
      }
    };
    getOnlineTutors();
  }, []);

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
    <HomeWorkHelpContainer>
      {user && aitutorchatLimitReached && (
        <Modal
          isOpen={isLimitModalOpen}
          onClose={() => setisLimitModalOpen(false)}
        >
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
              <Button
                variant="ghost"
                onClick={() => setisLimitModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <HomeWorkHelpHistoryContainer>
        <ChatHistory
          studentId={studentId}
          setConversationId={setConversationId}
          conversationId={conversationId}
          isSubmitted={isSubmitted}
          setCountNeedTutor={setCountNeedTutor}
          localData={localData}
          setMessages={setMessages}
          setDeleteConservationModal={setDeleteConservationModal}
          deleteConservationModal={deleteConservationModal}
          setVisibleButton={setVisibleButton}
          setSocket={setSocket}
          setCertainConversationId={setCertainConversationId}
          messages={messages}
          setSomeBountyOpt={setSomeBountyOpt}
          setNewConversationId={setNewConversationId}
          isBountyModalOpen={isBountyModalOpen}
          setLocalData={setLocalData}
          setFreshConversationId={setFreshConversationId}
        />
      </HomeWorkHelpHistoryContainer>
      <HomeWorkHelpChatContainer>
        <Chat
          ref={ref}
          isReadyToChat={true} //change to aitutorchatLimitReached when ai service is deployed
          HomeWorkHelp
          isShowPrompt={isShowPrompt}
          messages={messages}
          llmResponse={llmResponse}
          botStatus={botStatus}
          onOpenModal={onOpenModal}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
          homeWorkHelpPlaceholder={'How can Shepherd help with your homework?'}
          handleClickPrompt={handleClickPrompt}
          countNeedTutor={countNeedTutor}
          onCountTutor={onCountTutor}
          handleAceHomeWorkHelp={handleAce}
          visibleButton={visibleButton}
          fetchDescription={fetchDescription}
          freshConversationId={freshConversationId}
          onChatHistory={onChatHistory}
          isHwchatLimitReached={aitutorchatLimitReached}
        />
      </HomeWorkHelpChatContainer>
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage}
          subMessage={plansModalSubMessage}
        />
      )}
      <CustomModal
        isOpen={isOpenModal}
        onClose={onOpenModal}
        modalSize="lg"
        style={{
          height: '100Vh',
          maxWidth: '100%'
        }}
      >
        <ViewTutors
          onOpenModal={onOpenModal}
          subjectID={localData.subjectId}
          onlineTutorsId={onlineTutorsId}
        />
      </CustomModal>

      {openAceHomework && (
        <ViewHomeWorkHelpDetails
          isHomeWorkHelp
          openAceHomework={openAceHomework}
          handleClose={handleClose}
          setMessages={setMessages}
          handleAceHomeWorkHelp={handleAceHomeWorkHelp}
          setSubject={setSubject}
          subjectId={subjectId}
          setLocalData={setLocalData}
          setLevel={setLevel}
          localData={localData}
          level={level}
          onRouteHomeWorkHelp={onRouteHomeWorkHelp}
          setDocumentId={setDocumentId}
          documentId={documentId}
        />
      )}

      <BountyOfferModal
        isBountyModalOpen={isBountyModalOpen}
        closeBountyModal={closeBountyModal}
        topic={localData?.topic || someBountyOpt?.topic}
        subject={localData?.subject || someBountyOpt?.subject}
        level={level.label || someBountyOpt?.level}
        description={description}
      />
      <PaymentDialog
        ref={paymentDialogRef}
        prefix={
          <Alert status="info" mb="22px">
            <AlertIcon>
              <MdInfo color={theme.colors.primary[500]} />
            </AlertIcon>
            <AlertDescription>
              Payment will not be deducted until after your first lesson, You
              may decide to cancel after your initial lesson.
            </AlertDescription>
          </Alert>
        }
      />
      <CustomSideModal onClose={onChatHistory} isOpen={isChatHistory}>
        <div style={{ marginTop: '3rem' }}>
          <MobileHomeWorkHelpHistoryContainer>
            <ChatHistory
              studentId={studentId}
              setConversationId={setConversationId}
              localData={localData}
              conversationId={conversationId}
              isSubmitted={isSubmitted}
              setCountNeedTutor={setCountNeedTutor}
              setMessages={setMessages}
              setDeleteConservationModal={setDeleteConservationModal}
              deleteConservationModal={deleteConservationModal}
              setVisibleButton={setVisibleButton}
              setSocket={setSocket}
              setCertainConversationId={setCertainConversationId}
              messages={messages}
              setSomeBountyOpt={setSomeBountyOpt}
              setNewConversationId={setNewConversationId}
              isBountyModalOpen={isBountyModalOpen}
              setLocalData={setLocalData}
              setFreshConversationId={setFreshConversationId}
              onChatHistory={onChatHistory}
            />
          </MobileHomeWorkHelpHistoryContainer>
        </div>
      </CustomSideModal>
    </HomeWorkHelpContainer>
  );
};
// };

export default HomeWorkHelp;
