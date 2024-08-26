import { Box, CloseButton, Icon, useToast, Text, Flex } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import PlansModal from '../../../../components/PlansModal';
import FileProcessingService from '../../../../helpers/files.helpers/fileProcessing';
import useFlashcardQuestionsJob from '../../../../hooks/useFlashcardQuestionJobs';
import ApiService from '../../../../services/ApiService';
import flashcardStore from '../../../../state/flashcardStore';
import userStore from '../../../../state/userStore';
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from 'react';
import CustomToast from '../../../../components/CustomComponents/CustomToast';
import { useNavigate } from 'react-router';
import { languages } from '../../../../helpers';

export enum TypeEnum {
  FLASHCARD = 'flashcard',
  MNEOMONIC = 'mneomonic',
  INIT = 'init'
}
export enum SourceEnum {
  DOCUMENT = 'document',
  SUBJECT = 'subject',
  MANUAL = 'manual',
  ANKI = 'anki',
  IMAGE_OCCLUSION = 'image_occlusion'
}
export enum QuestionGenerationStatusEnum {
  INIT = 'INIT',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED'
}
type SettingsType = {
  type: TypeEnum;
  source: SourceEnum;
};
export enum ModeEnum {
  CREATE = 'CREATE',
  EDIT = 'EDIT'
}
interface FlashcardData {
  deckname: string;
  level?: string;
  studyType: string;
  subject?: string;
  documentId?: string;
  topic?: string;
  studyPeriod: string;
  numQuestions: number;
  timerDuration?: string;
  hasSubmitted: boolean;
  studyDuration?: string;
  selectQuestionTypes?: string[];
  selectPagesInclude?: number;
  grade?: string;
  ingestId?: string;
  noteDoc?: string;
  startPage?: number;
  endPage?: number;
  availableTimeStart?: string;
  availableTimeEnd?: string;
  totalStudyHours?: number;
  frequencyPerWeek?: number;
  sessionDurationMinutes?: string;
  studyEndDate?: string;
  questions?: Array<FlashcardQuestion>;
}
export interface FlashcardQuestion {
  questionType: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  helperText?: string;
}
export interface CurrentEditFlashcard extends FlashcardData {
  questions: FlashcardQuestion[];
}
export type AIRequestBody = {
  topic?: string;
  count: number;
  subject?: string;
  difficulty?: string;
  grade?: string;
  note?: string;
  existingQuestions?: string[];
  firebaseId: string;
  language: (typeof languages)[number];
};
export interface FlashcardDataContextProps {
  flashcardData: FlashcardData;
  currentStep: number;
  resetFlashcard: () => void;
  isResetted: boolean;
  goToNextStep: () => void;
  goToStep: (step: number) => void;
  questions: FlashcardQuestion[];
  currentQuestionIndex: number;
  isSaveSuccessful: boolean;
  goToQuestion: (index: number | ((previousIndex: number) => number)) => void;
  deleteQuestion: (index: number) => void;
  addQuestionsToFlashcard: () => void;
  setQuestions: React.Dispatch<React.SetStateAction<FlashcardQuestion[]>>;
  setFlashcardData: React.Dispatch<React.SetStateAction<FlashcardData>>;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
  settings: SettingsType;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isMinimized: boolean;
  setMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentQuestionData: (
    data:
      | Partial<FlashcardQuestion>
      | ((data: FlashcardQuestion) => FlashcardQuestion)
  ) => void;
  convertAnkiToShepherd: (base64string: string) => Promise<void>;
  generateFlashcardQuestions: (
    lang: (typeof languages)[number],
    d?: FlashcardData,
    onDone?: (success: boolean) => void,
    ingestDoc?: boolean
  ) => Promise<void>;
  questionGenerationStatus: QuestionGenerationStatusEnum;
  saveFlashcardData: (
    onDone?: ((success: boolean) => void) | undefined
  ) => Promise<void>;
  setMode: React.Dispatch<React.SetStateAction<ModeEnum>>;
  mode: ModeEnum;
  cancelQuestionGeneration: () => void;
  loadMoreQuestions: (count: number, lang: (typeof languages)[number]) => void;
  stageFlashcardForEdit: (flashcard: CurrentEditFlashcard) => void;
}
const FlashcardDataContext = createContext<
  FlashcardDataContextProps | undefined
>(undefined);
export const useFlashcardWizard = () => {
  const context = useContext(FlashcardDataContext);
  if (!context) {
    throw new Error(
      'useFlashcardDataContext must be used within a FlashcardWizardProvider'
    );
  }
  return context;
};
let cancelRequest = false;
const FlashcardWizardProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const toast = useToast();

  const { hasActiveSubscription, user, flashcardCountLimit } = userStore();
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const { createFlashCard } = flashcardStore();
  const { watchJobs, clearJobs } = useFlashcardQuestionsJob(
    user?._id as string
  );
  const [settings, setSettings] = useState<SettingsType>({
    type: TypeEnum.INIT,
    source: SourceEnum.SUBJECT
  });
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.CREATE);
  const [generationCancelled, setGenerationCancelled] = useState(false);
  const [isResetted, setResetted] = useState(false);
  const defaultFlashcardData = useMemo(
    () => ({
      deckname: '',
      studyType: '',
      studyPeriod: '',
      numQuestions: 0,
      timerDuration: '',
      hasSubmitted: false
    }),
    []
  );

  const checkFlashcardLimit = async (requestedCount) => {
    const flashcardCountResponse = await ApiService.checkFlashcardCount(
      user.student._id
    );
    const userFlashcardCount = await flashcardCountResponse.json();

    const remainingQuota = flashcardCountLimit - userFlashcardCount.count;

    // Check if the user is completely out of generation space
    if (remainingQuota <= 0) {
      setPlansModalMessage(
        !hasActiveSubscription
          ? "Let's get you on a plan so you can generate flashcards! "
          : "You've hit the limit for flashcard generation on your current plan! 🚀"
      );
      setPlansModalSubMessage(
        !hasActiveSubscription
          ? 'Get started today for free!'
          : "Let's upgrade your plan so you can keep generating more."
      );
      setTogglePlansModal(true);
      return { canProceed: false, adjustedCount: 0 };
    } else if (requestedCount > remainingQuota) {
      // If the user requests more questions than their remaining quota
      toast({
        render: ({ onClose }) => (
          <Box
            color="white"
            p={4}
            bg="blue.500"
            borderRadius="md"
            position="relative"
          >
            <Flex align="start">
              <Icon as={InfoIcon} color="white" w={5} h={5} mt="1" mr={3} />
              <Box flex="1">
                <Text fontSize="md" mr={6} ml={8}>
                  You've requested {requestedCount} flashcard
                  {remainingQuota > 1 ? 's' : ''}, but you can only generate
                  {remainingQuota} more under your current plan.
                </Text>
                <Text fontSize="sm" mt={4} mr={6} ml={6}>
                  Consider upgrading your plan for more flashcard generations.
                </Text>
              </Box>
            </Flex>
            <CloseButton
              position="absolute"
              top="1"
              right="1"
              onClick={onClose}
              color="white"
            />
          </Box>
        ),
        isClosable: true
      });
      return { canProceed: true, adjustedCount: remainingQuota };
    }

    return { canProceed: true, adjustedCount: requestedCount };
  };

  const cancelQuestionGeneration = useCallback(() => {
    cancelRequest = true;
    setIsLoading(false);
    setQuestionGenerationStatus(QuestionGenerationStatusEnum.INIT);
  }, []);
  const navigate = useNavigate();
  const [flashcardData, setFlashcardData] =
    useState<FlashcardData>(defaultFlashcardData);
  const [questions, setQuestions] = useState<FlashcardQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveSuccessful, setSaveSuccessful] = useState(false);
  const [questionGenerationStatus, setQuestionGenerationStatus] =
    useState<QuestionGenerationStatusEnum>(QuestionGenerationStatusEnum.INIT);
  const [isMinimized, setMinimized] = useState(false);
  const goToQuestion = useCallback(
    (arg: number | ((previousIndex: number) => number)) => {
      const index = typeof arg === 'function' ? arg(currentQuestionIndex) : arg;
      setCurrentQuestionIndex(index);
    },
    [currentQuestionIndex]
  );
  useEffect(() => {
    if (isResetted) {
      setResetted(false);
    }
    // eslint-disable-next-line
  }, [flashcardData]);
  const deleteQuestion = useCallback((index: number) => {
    setQuestions((prev) => {
      const newQuestions = prev.filter(
        (_, questionIndex) => questionIndex !== index
      );
      // Subtract one from currentQuestionIndex since one question is deleted
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
      return newQuestions;
    });
  }, []);

  const setCurrentQuestionData = useCallback(
    (
      arg:
        | FlashcardQuestion
        | ((previousIndex: FlashcardQuestion) => FlashcardQuestion)
    ) => {
      setQuestions((prev) => {
        const index = currentQuestionIndex;
        const newQuestions = [...prev];
        const question =
          typeof arg === 'function'
            ? arg(prev[index])
            : (arg as FlashcardQuestion);
        newQuestions[index] = question;
        return newQuestions;
      });
    },
    [currentQuestionIndex]
  );
  useEffect(() => {
    const questionsEmptyState = {
      questionType: 'openEnded',
      question: '',
      options: [], // Initialized options as empty array
      answer: ''
    };
    if (flashcardData?.numQuestions && !questions?.length) {
      const numQuestions = flashcardData?.numQuestions;
      const generatedQuestions: FlashcardQuestion[] = [];
      for (let i = 0; i < numQuestions; i++) {
        generatedQuestions.push(questionsEmptyState);
      }
      setQuestions(generatedQuestions);
    }
  }, [flashcardData?.numQuestions, questions]);
  const resetFlashcard = useCallback(() => {
    setFlashcardData(defaultFlashcardData);
    setQuestions([]);
    setSaveSuccessful(false);
    setCurrentStep(0);
    setCurrentQuestionIndex(0);
    setQuestionGenerationStatus(QuestionGenerationStatusEnum.INIT);
    setResetted(true);
  }, [defaultFlashcardData]);
  const stageFlashcardForEdit = useCallback(
    (cardData: CurrentEditFlashcard) => {
      const { questions: quizQuestions, ...rest } = cardData;
      setFlashcardData((prev) => ({ ...prev, ...rest }));
      setQuestions((prev) => [...prev, ...quizQuestions]);
      // setCurrentStep((prev) => prev + 1);
      setSettings({
        type: TypeEnum.FLASHCARD,
        source: cardData.topic ? SourceEnum.SUBJECT : SourceEnum.MANUAL
      });
      setMode(ModeEnum.EDIT);
    },
    []
  );
  const handleError = useCallback(
    (onDone?: (success: boolean, error?: string) => void, error?: string) => {
      setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
      setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
      onDone && onDone(false, error);
    },
    [setQuestionGenerationStatus, setFlashcardData]
  );
  // Process the document-related request
  const processDocumentRequest = useCallback(
    async (
      reqData: FlashcardData,
      ingestDoc: boolean,
      aiData: AIRequestBody,
      onDone?: (success: boolean, error?: string) => void
    ) => {
      const responseData = {
        title: reqData.topic as string,
        student: user?._id as string,
        documentUrl: reqData?.documentId as string
      };
      let documentId = reqData.ingestId || reqData?.documentId;
      if (ingestDoc && !reqData.ingestId) {
        const fileInfo = new FileProcessingService(responseData);
        // const {
        //   data: [{ documentId: docId }]
        // } = await fileInfo.process();
        // documentId = docId;
      }
      try {
        // Create a new URL object
        const url = new URL(documentId as string);
        // Extract the pathname, which will give you the relative path
        documentId = decodeURIComponent(url.pathname.split('/').pop() || '');
      } catch (error) {
        // If there's an error, it's likely not a valid URL, so just use documentId as is
      }
      const response = await ApiService.createDocchatFlashCards({
        ...aiData,
        subscriptionTier: user?.subscription?.tier, //passing to use in AWS lambda to control gpt version
        studentId: user?._id as string,
        documentId: documentId as string
      });
      const { status } = response;

      if (status === 200) {
        const { body } = await response.json();
        const jobId = body.data.jobId;
        if (!jobId) {
          throw new Error('Job ID not found');
        } else {
          watchJobs(jobId as string, (error, questions) => {
            if (error) {
              throw new Error(error);
            } else {
              if (questions && questions.length) {
                setQuestions(questions);
                setCurrentStep(1);
                setQuestionGenerationStatus(
                  QuestionGenerationStatusEnum.SUCCESSFUL
                );
                // setTimeout(() => clearJobs(documentId as string), 500);
              }
            }
            setIsLoading(false);
          });
        }
      } else {
        throw new Error('Failed to generate flashcards');
      }

      return response;
    },
    [user, watchJobs, handleError]
  );
  // Handle the API response
  const handleResponse = useCallback(
    async (response: Response, onDone?: (success: boolean) => void) => {
      if (response.status === 200) {
        const data = await response.json();
        const questions = data.flashcards.map((d: any) => ({
          question: d.front,
          answer: d.back,
          explanation: d.explainer,
          helperText: d['helpful reading'],
          questionType: 'openEnded'
        }));
        setQuestions(questions);
        setCurrentStep((prev) => prev + 1);
        setQuestionGenerationStatus(QuestionGenerationStatusEnum.SUCCESSFUL);
        onDone && onDone(true);
      } else {
        handleError(onDone);
      }
    },
    [setQuestions, setCurrentStep, setQuestionGenerationStatus, handleError]
  );
  const loadMoreQuestions = useCallback(
    async (count = 5, lang: (typeof languages)[number]) => {
      try {
        const { canProceed, adjustedCount } = await checkFlashcardLimit(count);

        if (!canProceed) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        // Construct the AI request body
        const aiData: AIRequestBody = {
          topic: flashcardData.topic,
          subject: flashcardData.subject,
          count: adjustedCount,
          firebaseId: user?.firebaseId,
          ...(flashcardData.level && { difficulty: flashcardData.level }),
          ...(flashcardData.noteDoc && { note: flashcardData.noteDoc }),
          existingQuestions: questions.map((q) => q.question),
          language: lang
        };
        // Call the API to fetch more questions
        let response: any;
        if (!flashcardData.noteDoc) {
          response = await ApiService.generateFlashcardQuestions(
            aiData,
            user?._id as string,
            lang
          );
        } else {
          response = await ApiService.generateFlashcardQuestionsForNotes(
            aiData,
            user?._id as string,
            user?.firebaseId as string,
            lang
          );
        }
        if (cancelRequest) {
          cancelRequest = false;
          return;
        }
        if (response.status === 200) {
          const data = await response.json();
          const additionalQuestions = data.flashcards.map((d: any) => ({
            question: d.front,
            answer: d.back,
            explanation: d.explainer,
            helperText: d['helpful reading'],
            questionType: 'openEnded'
          }));
          // Add the fetched questions to the current list
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            ...additionalQuestions
          ]);
        } else {
          // console.error('Failed to load more questions');
        }
      } catch (error) {
        // console.error('Error loading more questions:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [flashcardData, questions, user]
  );

  const addQuestionsToFlashcard = useCallback(() => {
    const additionalQuestion = {
      question: '',
      answer: '',
      explanation: '',
      helperText: '',
      questionType: 'openEnded'
    };
    const questionIndex = questions.length;
    setQuestions((prev) => [...prev, additionalQuestion]);
    goToQuestion(questionIndex);
  }, [questions, goToQuestion]);
  const convertAnkiToShepherd = useCallback(
    async (base64string: string) => {
      try {
        setIsLoading(true);

        const resp = await ApiService.convertAnkiToShep({
          base64String: base64string
        });
        const r: { data: FlashcardData } = await resp.json();

        setFlashcardData(r.data);
        setQuestions(r.data.questions);
        setIsLoading(false);
        toast({
          render: () => (
            <CustomToast
              title={'Successfully created Flashdeck from Anki'}
              status="success"
            />
          ),
          position: 'top-right',
          isClosable: true
        });
        setTimeout(() => {
          //
          navigate('/dashboard/flashcards');
        }, 500);
      } catch (error) {
        toast({
          render: () => <CustomToast title={error.message} status="fail" />,
          position: 'top-right',
          isClosable: true
        });
        handleError();
      }
    },
    [handleError]
  );
  const generateFlashcardQuestions = useCallback(
    async (
      lang: (typeof languages)[number],
      data?: FlashcardData,
      onDone?: (success: boolean) => void,
      ingestDoc = true
    ) => {
      let reqData = data || flashcardData;
      try {
        const { canProceed, adjustedCount } = await checkFlashcardLimit(
          reqData.numQuestions
        );
        if (!canProceed) {
          return;
        }
        reqData.numQuestions = adjustedCount;
        data = data || ({} as FlashcardData);
        reqData = {
          ...flashcardData,
          ...data,
          numQuestions: reqData.numQuestions
        };
        setIsLoading(true);
        setQuestionGenerationStatus(QuestionGenerationStatusEnum.INIT);
        const aiData: AIRequestBody = {
          topic: reqData.topic,
          subject: reqData.subject,
          grade: reqData.grade,
          count: parseInt(reqData.numQuestions as unknown as string, 10),
          firebaseId: user?.firebaseId,
          ...(reqData.level && { difficulty: reqData.level }),
          ...(reqData.noteDoc && { note: reqData.noteDoc }),
          ...(reqData?.documentId &&
            reqData.startPage && { start_page: reqData.startPage }),
          ...(reqData.documentId &&
            reqData.endPage && { end_page: reqData.startPage }),
          language: lang
        };
        let response;
        if (reqData?.documentId) {
          response = await processDocumentRequest(reqData, ingestDoc, aiData);
        } else {
          let response: any;
          if (!reqData.noteDoc) {
            response = await ApiService.generateFlashcardQuestions(
              aiData,
              user?._id as string,
              lang
            );
          } else {
            response = await ApiService.generateFlashcardQuestionsForNotes(
              aiData,
              user?._id as string,
              user?.firebaseId as string,
              lang
            );
          }

          if (cancelRequest) {
            cancelRequest = false;
          } else {
            await handleResponse(response, onDone);
          }
        }
      } catch (error: any) {
        handleError(onDone, error.message);
      } finally {
        if (!reqData?.documentId) {
          setIsLoading(false);
        }
      }
    },
    [flashcardData, user, handleError, processDocumentRequest, handleResponse]
  );
  // Handle errors
  const saveFlashcardData = useCallback(
    async (onDone?: (success: boolean) => void) => {
      try {
        setIsLoading(true);
        const response = await createFlashCard(
          { ...flashcardData, questions },
          'manual'
        );
        if (response) {
          if (response.status === 200) {
            setSaveSuccessful(true);
            onDone && onDone(true);
          } else {
            onDone && onDone(false);
          }
        }
      } catch (error) {
        setQuestionGenerationStatus(QuestionGenerationStatusEnum.FAILED);
        setFlashcardData((prev) => ({ ...prev, hasSubmitted: false }));
        onDone && onDone(false);
      } finally {
        setIsLoading(false);
      }
    },
    [flashcardData, createFlashCard, questions]
  );
  const value = useMemo(
    () => ({
      flashcardData,
      setFlashcardData,
      setLoader: setIsLoading,
      isLoading,
      isSaveSuccessful,
      questions,
      currentStep,
      currentQuestionIndex,
      setCurrentQuestionData,
      goToQuestion,
      deleteQuestion,
      resetFlashcard,
      setQuestions,
      generateFlashcardQuestions,
      convertAnkiToShepherd,
      addQuestionsToFlashcard,
      goToNextStep: () => setCurrentStep((prev) => prev + 1),
      goToStep: (stepIndex: number) => setCurrentStep(stepIndex),
      settings,
      setMinimized,
      isMinimized,
      setSettings,
      questionGenerationStatus,
      saveFlashcardData,
      isResetted,
      cancelQuestionGeneration,
      setMode,
      mode,
      loadMoreQuestions,
      stageFlashcardForEdit
    }),
    [
      flashcardData,
      isSaveSuccessful,
      isLoading,
      setFlashcardData,
      questions,
      currentStep,
      currentQuestionIndex,
      resetFlashcard,
      goToQuestion,
      deleteQuestion,
      setQuestions,
      generateFlashcardQuestions,
      settings,
      addQuestionsToFlashcard,
      setSettings,
      setMinimized,
      isMinimized,
      questionGenerationStatus,
      saveFlashcardData,
      isResetted,
      cancelQuestionGeneration,
      setMode,
      mode,
      setCurrentQuestionData,
      loadMoreQuestions,
      stageFlashcardForEdit
    ]
  );
  return (
    <FlashcardDataContext.Provider value={value}>
      {children}
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage} // Pass the message to the modal
          subMessage={plansModalSubMessage}
        />
      )}
    </FlashcardDataContext.Provider>
  );
};
export default FlashcardWizardProvider;
