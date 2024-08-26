import React from 'react';
import { useCallback, useEffect } from 'react';
import './init';
import LexicalContext from './components/Editor/context';
import { FlashCardModal } from './components/flashcardDecks';
import { QuizModal } from './components/quizDecks';
import { useActiveUserPresence } from './hooks/setUserPrensence';
import { AuthProvider } from './providers/auth.provider';
import { StreamChatProvider } from './providers/streamchat.provider';
import flashcardStore from './state/flashcardStore';
import quizStore from './state/quizStore';
import resourceStore from './state/resourceStore';
import theme from './theme';
import FlashcardWizardProvider from './views/Dashboard/FlashCards/context/flashcard';
import FlashcardSkeleton from './components/FlashcardSkeleton';
import MnemonicSetupProvider from './views/Dashboard/FlashCards/context/mneomics';
import { Box, ChakraProvider, Skeleton } from '@chakra-ui/react';

import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom';
import 'stream-chat-react/dist/scss/v2/index.scss';
import Hotjar from '@hotjar/browser';
import AppRoutes from './routes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Tutor specific routes configuration

// Routes based on userType

const hotjarVersion = 6;
const siteId = process.env.REACT_APP_HOTJAR_SITE_ID;

const queryClient = new QueryClient();

function App() {
  const { fetchResources } = resourceStore();
  const {
    flashcard,
    showStudyList,
    isLoading: isLoadingFlashcard
  } = flashcardStore();
  const { startQuizModal, quiz } = quizStore();
  useActiveUserPresence();

  const doFetchResources = useCallback(async () => {
    await fetchResources();
    /* eslint-disable */
  }, []);

  // Fetch resources on app load
  useEffect(() => {
    doFetchResources();
  }, [doFetchResources]);

  useEffect(() => {
    Hotjar.init(Number(siteId), hotjarVersion);
  }, []);

  // return <h1>Hello</h1>;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LexicalContext>
            <ChakraProvider theme={theme}>
              <AuthProvider>
                <FlashcardWizardProvider>
                  <MnemonicSetupProvider>
                    <FlashcardSkeleton
                      isOpen={isLoadingFlashcard}
                      onClose={!isLoadingFlashcard}
                    />

                    <FlashCardModal
                      isOpen={Boolean(flashcard) || showStudyList}
                    />
                    {startQuizModal && <QuizModal isOpen={startQuizModal} />}
                    <StreamChatProvider>
                      <AppRoutes />
                    </StreamChatProvider>
                  </MnemonicSetupProvider>
                </FlashcardWizardProvider>
              </AuthProvider>
            </ChakraProvider>
          </LexicalContext>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
