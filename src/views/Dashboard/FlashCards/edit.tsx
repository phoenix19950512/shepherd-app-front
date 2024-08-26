/* eslint-disable react-hooks/exhaustive-deps */
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import flashcardStore from '../../../state/flashcardStore';
import userStore from '../../../state/userStore';
import { useFlashcardWizard } from './context/flashcard';
import SetupFlashcardPage from './forms/flashcard_setup';
import FlashcardFromDocumentSetup from './forms/flashcard_setup/document_type';
import LoaderScreen from './forms/flashcard_setup/loader_page';
import SuccessState from './forms/flashcard_setup/success_page';
import MnemonicSetup from './forms/mneomics_setup';
import InitSetupPreview from './previews/init.preview';
import MnemonicPreview from './previews/mneomics.preview';
import QuestionsPreview from './previews/questions.preview';
import { Box, HStack, Text, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  RefObject
} from 'react';
import { useParams, useLocation } from 'react-router';
import styled from 'styled-components';

const Wrapper = styled(Box)`
  select {
    padding-bottom: 7px !important;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #e4e5e7;
    background-color: #ffffff;
    box-shadow: 0 2px 6px 0 rgba(136, 139, 143, 0.1);
    font-size: 14px;
    line-height: 20px;
    color: #212224;
    margin-bottom: 10px;

    &::placeholder {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.3%;
      color: #9a9da2 !important;
    }
  }
  select * {
    font-size: 14px !important;
    line-height: 20px !important;
    color: #212224 !important;
    border-radius: 4px !important;
    padding: 6px 8px 6px 6px !important;
    margin-bottom: 10px !important;
    background-color: #f2f4f8 !important;
  }

  /* Hover effect */
  select *:hover {
    background-color: #f2f4f8 !important;
  }
`;

export enum TypeEnum {
  FLASHCARD = 'flashcard',
  MNEOMONIC = 'mneomonic',
  INIT = 'init'
}

export enum SourceEnum {
  DOCUMENT = 'document',
  SUBJECT = 'subject',
  MANUAL = 'manual'
}

type SettingsType = {
  type: TypeEnum;
  source: SourceEnum;
};

const useBoxWidth = (ref: RefObject<HTMLDivElement>): number => {
  const [boxWidth, setBoxWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const newWidth = ref.current.offsetWidth;
        setBoxWidth(newWidth);
      }
    };

    // Initial width calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return boxWidth;
};

function transformFlashcardQuestion(originalQuestion: any) {
  return {
    questionType: originalQuestion.questionType,
    question: originalQuestion.question,
    options: originalQuestion.options,
    answer: originalQuestion.answer,
    explanation: originalQuestion.explanation,
    helperText: originalQuestion.helperText
  };
}

function transformFlashcardData(originalData: any) {
  return {
    deckname: originalData.deckname,
    level: originalData.level,
    studyType: originalData.studyType,
    subject: originalData.subject,
    documentId: originalData?.documentId,
    hasSubmitted: false,
    topic: originalData.topic,
    studyPeriod: originalData.studyPeriod,
    numQuestions: originalData.questions?.length || 0,
    questions: originalData.questions?.map(transformFlashcardQuestion)
  };
}

const EditFlashCard = () => {
  const toast = useCustomToast();
  const { user } = userStore();
  const location = useLocation();

  // const [settings, setSettings] = useState<SettingsType>({
  //   type: TypeEnum.INIT,
  //   source: SourceEnum.SUBJECT
  // });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const boxWidth = useBoxWidth(wrapperRef);

  const {
    flashcardData,
    questions,
    goToStep,
    setFlashcardData,
    resetFlashcard,
    isLoading: loading,
    setLoader,
    currentStep,
    settings,
    setSettings,
    setMinimized,
    stageFlashcardForEdit
  } = useFlashcardWizard();

  const { createFlashCard, isLoading, fetchFlashcards, editFlashcard } =
    flashcardStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [switchonMobile, setSwitchMobile] = useState(true);
  const { type: activeBadge } = settings;
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);

  const type = queryParams.get('type');

  const setActiveBadge = (badge: TypeEnum) => {
    setSettings((value) => ({ ...value, type: badge }));
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchFlashcard = useCallback(async () => {
    try {
      flashcardStore.setState((state) => ({ isLoading: true }));
      const response = await ApiService.getSingleFlashcard(id);
      if (response.status === 200) {
        const data = await response.json();
        const flashcard = transformFlashcardData(data.data);
        stageFlashcardForEdit(flashcard);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      flashcardStore.setState((state) => ({ isLoading: false }));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      resetFlashcard();
      fetchFlashcard();
    }
  }, [id]);

  useEffect(() => {
    if (type) {
      if (type === 'mnemonics') {
        setActiveBadge(TypeEnum.MNEOMONIC);
      }
      if (type === 'flashcard') {
        setActiveBadge(TypeEnum.FLASHCARD);
      }
    }
  }, [type]);

  useEffect(() => {
    setMinimized(false);

    return () => {
      if (loading) {
        setMinimized(true);
      }
    };
  }, [loading]);

  const onSubmitFlashcard = useCallback(async () => {
    try {
      const response = await editFlashcard(id, {
        ...flashcardData,
        questions: questions as any
      } as any);
      if (response) {
        setIsCompleted(true);
        toast({
          title: 'Flash Card Updated Successfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
        fetchFlashcards();
      } else {
        setFlashcardData((value) => ({ ...value, hasSubmitted: false }));
        toast({
          title: 'Failed to create flashcard, try again',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error) {
      setFlashcardData((value) => ({ ...value, hasSubmitted: false }));
      toast({
        title: 'Failed to create flashcard, try again',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  }, [
    flashcardData,
    questions,
    toast,
    setFlashcardData,
    fetchFlashcards,
    createFlashCard
  ]);

  useEffect(() => {
    if (flashcardData?.hasSubmitted) {
      if (settings.type !== TypeEnum.FLASHCARD) {
        setSettings((value) => ({ ...value, type: TypeEnum.FLASHCARD }));
      }
      // if (
      //   settings.type !== TypeEnum.FLASHCARD &&
      //   settings.type !== TypeEnum.INIT &&
      //   settings.source !== SourceEnum.MANUAL
      // ) {
      //   setSettings((value) => ({ ...value, source: SourceEnum.MANUAL }));
      // }
    }
  }, [flashcardData?.hasSubmitted, settings?.type, settings?.source]);

  const handleBadgeClick = (badge: TypeEnum) => {
    if (
      (settings.source === SourceEnum.DOCUMENT &&
        badge !== TypeEnum.FLASHCARD) ||
      flashcardData.hasSubmitted
    )
      return;
    setActiveBadge(badge);

    // if (badge === TypeEnum.MNEOMONIC) setSource(SourceEnum.MANUAL);
  };

  const setSource = (source: SourceEnum) => {
    setSettings((val) => ({
      ...val,
      source
    }));
  };

  const form = useMemo(() => {
    if (settings.type === TypeEnum.MNEOMONIC) {
      return <MnemonicSetup />;
    }

    if (isCompleted) {
      return (
        <SuccessState
          reset={() => {
            resetFlashcard();
            setIsCompleted(false);
          }}
        />
      );
    }
    if (loading) {
      return <LoaderScreen />;
    }
    if (
      (settings.type === TypeEnum.FLASHCARD ||
        settings.type === TypeEnum.INIT) &&
      (settings.source === SourceEnum.MANUAL ||
        (settings.source === SourceEnum.DOCUMENT && currentStep === 1))
    ) {
      return <SetupFlashcardPage />;
    }
    if (
      (settings.type === TypeEnum.FLASHCARD ||
        settings.type === TypeEnum.INIT) &&
      settings.source === SourceEnum.MANUAL
    ) {
      return <SetupFlashcardPage />;
    }
    if (settings.source === SourceEnum.SUBJECT) {
      return <SetupFlashcardPage isAutomated />;
    }
    if (settings.source === SourceEnum.DOCUMENT) {
      return <FlashcardFromDocumentSetup isAutomated />;
    }

    return <SetupFlashcardPage isAutomated />;
  }, [settings, isCompleted, resetFlashcard, loading, currentStep]); // The callback depends on 'settings'

  const renderPreview = () => {
    if (settings.type === TypeEnum.INIT) {
      return (
        <InitSetupPreview
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        />
      );
    }
    if (settings.type === TypeEnum.FLASHCARD) {
      return (
        <QuestionsPreview
          isLoading={isLoading}
          onConfirm={() => onOpen()}
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
          isCompleted={isCompleted}
        ></QuestionsPreview>
      );
    }
    if (settings.type === TypeEnum.MNEOMONIC) {
      return (
        <MnemonicPreview
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        ></MnemonicPreview>
      );
    }
  };

  const onSwitchMobile = useCallback(() => {
    setSwitchMobile((prevState) => !prevState);
  }, [setSwitchMobile]);

  const onConfirm = async () => {
    onClose(); // Close the modal
    await onSubmitFlashcard(); // Call the submit function
  };

  const renderConfirmationModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader paddingBottom={'0px'}>Confirm Action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Updating this flashcard would reset your score history
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onConfirm}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box width={'100%'}>
      {/* {isLoading && <LoaderOverlay />} */}
      {renderConfirmationModal()}
      <Wrapper
        ref={wrapperRef}
        bg="white"
        width="100%"
        display="flex"
        position={'relative'}
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }} // Add this line
        alignItems="center"
        minH="calc(100vh - 60px)"
      >
        <HStack
          justifyContent={'start'}
          alignItems={'start'}
          width={switchonMobile ? '100%' : 'auto'}
          display={'flex'}
          minH="calc(100vh - 60px)"
        >
          <VStack
            display={'flex'}
            justifyContent={'start'}
            alignItems={'center'}
            height="100%"
            flex="1"
            maxWidth={{ md: `${boxWidth / 2}px`, base: '100%' }}
            position={'relative'}
          >
            {activeBadge !== TypeEnum.MNEOMONIC && (
              <Box
                display={'flex'}
                borderBottom={'1px solid #E7E8E9'}
                flexDirection={'column'}
                width={'100%'}
                padding="30px"
              >
                <Box
                  display={'flex'}
                  width={'100%'}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    fontFamily="Inter"
                    fontWeight="500"
                    fontSize="18px"
                    lineHeight="23px"
                    color="#212224"
                    mb={4}
                  >
                    Select a Source
                  </Text>
                  <Text
                    fontFamily="Inter"
                    fontWeight="500"
                    fontSize="12px"
                    lineHeight="23px"
                    color="#212224"
                    mb={4}
                    display={{ base: 'flex', md: 'none' }}
                    alignItems={{ base: 'center' }}
                    border={'1px solid #E7E8E9'}
                    padding="8px"
                    borderRadius={'10%'}
                    onClick={onSwitchMobile}
                  >
                    View FlashCards & Mnemonics
                  </Text>
                </Box>

                <RadioGroup
                  onChange={(value: SourceEnum) => {
                    setSource(value as SourceEnum);
                    if (
                      value === SourceEnum.SUBJECT &&
                      settings.source !== SourceEnum.SUBJECT
                    ) {
                      goToStep(0);
                      setFlashcardData((value) => ({
                        ...value,
                        hasSubmitted: false
                      }));
                    }
                    if (value === SourceEnum.DOCUMENT) {
                      handleBadgeClick(TypeEnum.FLASHCARD);
                    }
                  }}
                  value={settings.source}
                >
                  <HStack align="start" spacing={7}>
                    <Radio value={SourceEnum.DOCUMENT} isDisabled={isCompleted}>
                      <Text color="#585F68">Document</Text>
                    </Radio>
                    <Radio value={SourceEnum.SUBJECT} isDisabled={isCompleted}>
                      <Text color="#585F68">Auto</Text>
                    </Radio>
                    <Radio value={SourceEnum.MANUAL} isDisabled={isCompleted}>
                      <Text color="#585F68">Manual</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>
            )}
            {switchonMobile ? (
              <Box
                py="45px"
                paddingX={'30px'}
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                width="95%"
                borderRadius="10px"
                height="70vh"
                overflowY="scroll"
                sx={{
                  '::-webkit-scrollbar': {
                    display: 'none'
                  },
                  'scrollbar-width': 'none',
                  '-ms-overflow-style': 'none'
                }}
              >
                {form}
              </Box>
            ) : (
              <Box
                py="45px"
                paddingX={'30px'}
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                width="95%"
                borderRadius="10px"
                height="80vh"
                overflowY="scroll"
                sx={{
                  '::-webkit-scrollbar': {
                    display: 'none'
                  },
                  'scrollbar-width': 'none',
                  '-ms-overflow-style': 'none'
                }}
              >
                {renderPreview()}
              </Box>
            )}
          </VStack>
          {/* Render the right item here */}
          <VStack
            borderLeft="1px solid #E7E8E9"
            top="60px"
            width={`${boxWidth / 2}px`}
            maxWidth={`${boxWidth / 2}px`}
            right="0"
            bottom={'0'}
            position={'fixed'}
            display={{ base: 'none', md: 'flex' }}
          >
            {renderPreview()}
          </VStack>
        </HStack>
      </Wrapper>
    </Box>
  );
};

export default EditFlashCard;
