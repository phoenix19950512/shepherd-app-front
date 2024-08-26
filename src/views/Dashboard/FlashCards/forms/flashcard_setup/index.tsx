import StepsIndicator, { Step } from '../../../../../components/StepIndicator';
import { useFlashcardWizard } from '../../context/flashcard';
import FlashCardSetupInit from './init';
import LoaderScreen from './loader_page';
import FlashCardQuestionsPage from './questions';
import SuccessState from './success_page';
import { Box, Text } from '@chakra-ui/react';
import { Tag, TagLabel } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const transition = {
  duration: 0.3,
  ease: 'easeInOut'
};

const slideVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0%' },
  exit: { x: '100%' }
};

const SetupFlashcardPage = ({
  isAutomated,
  showConfirm
}: {
  isAutomated?: boolean;
  showConfirm?: boolean;
}) => {
  const { currentStep, isLoading, isSaveSuccessful, resetFlashcard } =
    useFlashcardWizard();
  const steps: Step[] = [{ title: '' }, { title: '' }, { title: '' }];
  const location = useLocation();

  const formComponents = useMemo(
    () => [FlashCardSetupInit, FlashCardQuestionsPage],
    []
  );

  const CurrentForm = useMemo(
    () => formComponents[currentStep],
    [currentStep, formComponents]
  );

  if (isSaveSuccessful) {
    return <SuccessState reset={() => resetFlashcard()} />;
  }

  if (isLoading) {
    return (
      <Box width={'100%'} height={'100%'}>
        <LoaderScreen />
      </Box>
    );
  }

  return (
    <>
      <Box width={'100%'}>
        <Text
          fontSize={{ md: '24px', base: '1.1rem' }}
          fontWeight="500"
          marginBottom="5px"
        >
          Set up flashcard
        </Text>
        {!isAutomated && (
          <Tag my="10px" borderRadius="5" background="#f7f8fa" size="md">
            <TagLabel>
              Step {currentStep + 1} of {steps.length}
            </TagLabel>
          </Tag>
        )}

        {CurrentForm && (
          <CurrentForm
            showConfirm={showConfirm}
            isAutomated={isAutomated}
            isFlashCardPage={
              location.pathname === '/dashboard/flashcards/create'
            }
          />
        )}
      </Box>
    </>
  );
};

export default SetupFlashcardPage;
