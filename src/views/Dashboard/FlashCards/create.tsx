/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import PlansModal from '../../../components/PlansModal';
import { FlashCardModal } from '../../../components/flashcardDecks';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import flashcardStore from '../../../state/flashcardStore';
import userStore from '../../../state/userStore';
import FlashcardDataProvider from './context/flashcard';
import { useFlashcardWizard } from './context/flashcard';
import MnemonicSetupProvider from './context/mneomics';
import SetupFlashcardPage from './forms/flashcard_setup';
import AnkiType from './forms/flashcard_setup/anki_type';
import FlashcardFromDocumentSetup from './forms/flashcard_setup/document_type';
import LoaderScreen from './forms/flashcard_setup/loader_page';
import SuccessState from './forms/flashcard_setup/success_page';
import MnemonicSetup from './forms/mneomics_setup';
import InitSetupPreview from './previews/init.preview';
import MnemonicPreview from './previews/mneomics.preview';
import QuestionsPreview from './previews/questions.preview';
import {
  Box,
  HStack,
  Text,
  Radio,
  RadioGroup,
  VStack,
  Center,
  Icon,
  Button
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
import { RiLockFill, RiLockUnlockFill } from 'react-icons/ri';
import ImageOcclusion from './forms/flashcard_setup/manual-occlusion-2';
import { cn } from '../../../library/utils';
import useIsMobile from '../../../helpers/useIsMobile';

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
  MANUAL = 'manual',
  ANKI = 'anki',
  IMAGE_OCCLUSION = 'image_occlusion'
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

const CreateFlashPage = () => {
  const toast = useCustomToast();
  const { user, hasActiveSubscription, activeSubscription }: any = userStore();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const boxWidth = useBoxWidth(wrapperRef);

  const {
    flashcardData,
    questions,
    goToStep,
    setFlashcardData,
    resetFlashcard,
    isLoading: loading,
    currentStep,
    settings,
    setSettings,
    setMinimized
  } = useFlashcardWizard();

  const { createFlashCard, isLoading, fetchFlashcards } = flashcardStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [switchonMobile, setSwitchMobile] = useState(true);
  const { type: activeBadge } = settings;

  const [isHovering, setIsHovering] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');

  const handleLockClick = () => {
    setTogglePlansModal(true);
  };

  //no longer worried about paywalling this for now, we have a freemmium tier
  // useEffect(() => {
  //   if (!hasActiveSubscription) {
  //     // Set messages and show the modal if the user has no active subscription
  //     setPlansModalMessage(
  //       !user.hadSubscription
  //         ? 'Subscribe to unlock your AI Study Tools! 🚀'
  //         : 'Pick a plan to access your AI Study Tools! 🚀'
  //     );
  //     setPlansModalSubMessage('One-click Cancel at anytime.');
  //     setTogglePlansModal(true);
  //   }
  // }, [user.subscription]);

  // const [settings, setSettings] = useState<SettingsType>({
  //   type: TypeEnum.INIT,
  //   source: SourceEnum.SUBJECT
  // });

  const queryParams = new URLSearchParams(location.search);

  const type = queryParams.get('type');

  const setActiveBadge = (badge: TypeEnum) => {
    setSettings((value) => ({ ...value, type: badge }));
  };

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
      const response = await createFlashCard(
        { ...flashcardData, questions },
        'manual'
      );
      if (response) {
        if (response.status === 200) {
          setIsCompleted(true);
          toast({
            title: 'Flash Card Created Successfully',
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
  }, [flashcardData?.hasSubmitted, settings.type, settings.source]);

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
    if (settings.source === SourceEnum.ANKI) {
      return <AnkiType />;
    }
    if (settings.source === SourceEnum.IMAGE_OCCLUSION) {
      return <ImageOcclusion />;
    }
    return <></>;
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
          onConfirm={() => onSubmitFlashcard()}
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
          isCompleted={isCompleted}
          setFlashcardData={setFlashcardData}
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

  // if (!hasActiveSubscription) {
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

  const [openPlansModel, setPlansModel] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Box width={'100%'}>
      {/* {isLoading && <LoaderOverlay />} */}
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
            // display={'flex'}
            justifyContent={'start'}
            alignItems={'center'}
            height="100%"
            // flex="1"
            // maxWidth={{ md: `${boxWidth / 2}px`, base: '100%' }}
            minWidth={{ md: '50%', sm: '100%' }}
            position={'relative'}
          >
            {activeBadge !== TypeEnum.MNEOMONIC && (
              <Box
                display={'flex'}
                borderBottom={'1px solid #E7E8E9'}
                flexDirection={'column'}
                width={'100%'}
                padding={{ md: '30px', base: '15px' }}
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

                  {!switchonMobile && (
                    <Button
                      variant="solid"
                      colorScheme="primary"
                      size="sm"
                      ml="auto"
                      fontSize={'14px'}
                      padding="20px 25px"
                      width="40%"
                      onClick={onSwitchMobile}
                    >
                      Go Back
                    </Button>
                  )}
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
                    // if (value === SourceEnum.IMAGE_OCCLUSION) {
                    //   if (
                    //     user.subscription &&
                    //     user.subscription.tier !== 'Premium'
                    //   ) {
                    //     setPlansModel(true);
                    //   }
                    // }
                  }}
                  value={settings.source}
                >
                  {switchonMobile && (
                    <HStack
                      align={{ md: 'start', base: 'center' }}
                      overflowX={{ base: 'scroll', md: 'hidden' }}
                      overflowY="hidden"
                      spacing={7}
                      sx={{
                        '&::-webkit-scrollbar': {
                          display: 'none' // Hides the scrollbar for webkit browsers
                        },
                        scrollbarWidth: 'none', // For Firefox
                        msOverflowStyle: 'none' // For Internet Explorer and Edge
                      }}
                    >
                      <Radio
                        value={SourceEnum.DOCUMENT}
                        isDisabled={isCompleted}
                      >
                        <Text color="#585F68">Document</Text>
                      </Radio>
                      <Radio
                        value={SourceEnum.SUBJECT}
                        isDisabled={isCompleted}
                      >
                        <Text color="#585F68">Auto</Text>
                      </Radio>
                      <Radio value={SourceEnum.MANUAL} isDisabled={isCompleted}>
                        <Text color="#585F68">Manual</Text>
                      </Radio>
                      {hasActiveSubscription &&
                        activeSubscription.tier === 'Premium' && (
                          <Radio
                            value={SourceEnum.ANKI}
                            isDisabled={isCompleted}
                          >
                            <Text color="#585F68">Anki</Text>
                          </Radio>
                        )}
                      <Radio value={SourceEnum.IMAGE_OCCLUSION}>
                        <Text color="#585F68">Image Occlusion</Text>
                      </Radio>
                    </HStack>
                  )}
                </RadioGroup>
              </Box>
            )}
            {switchonMobile ? (
              <Box
                py={{ md: '45px', base: '15px' }}
                paddingX={{ md: '30px', base: '15px' }}
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.2)"
                width="95%"
                borderRadius="10px"
                height="70vh"
                position={'absolute'}
                top="135px"
                overflowY="scroll"
                sx={{
                  '::-webkit-scrollbar': {
                    width: '4px',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: 0 // Initially set the opacity to 0
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#E7E8E9',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease-in-out'
                  },
                  '::-webkit-scrollbar-track': {
                    background: 'transparent',
                    cursor: 'pointer'
                  },
                  '&:hover': {
                    '::-webkit-scrollbar': {
                      opacity: 1 // Set the opacity to 1 on hover
                    }
                  }
                }}
              >
                {form}
                {isMobile && (
                  <Button
                    variant="solid"
                    colorScheme="primary"
                    size="sm"
                    ml="auto"
                    fontSize={'14px'}
                    mt={4}
                    padding="20px 25px"
                    marginLeft="80px"
                    onClick={onSwitchMobile}
                    isDisabled={loading}
                  >
                    View FlashCards & Mnemonics
                  </Button>
                )}
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
                    width: '4px',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: 0 // Initially set the opacity to 0
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#E7E8E9',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease-in-out'
                  },
                  '::-webkit-scrollbar-track': {
                    background: 'transparent',
                    cursor: 'pointer'
                  },
                  '&:hover': {
                    '::-webkit-scrollbar': {
                      opacity: 1 // Set the opacity to 1 on hover
                    }
                  }
                }}
              >
                {renderPreview()}
              </Box>
            )}
          </VStack>
          {/* Render the right item here */}
          {true && (
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
          )}
        </HStack>
      </Wrapper>
    </Box>
  );
};
// };

const MainWrapper = () => {
  return (
    <MnemonicSetupProvider>
      <CreateFlashPage />
    </MnemonicSetupProvider>
  );
};

export default MainWrapper;
