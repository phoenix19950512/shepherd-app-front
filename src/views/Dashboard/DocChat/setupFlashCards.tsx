import StepsIndicator, { Step } from '../../../components/StepIndicator';
import { useFlashcardWizard } from '../FlashCards/context/flashcard';
import FlashCardQuestionsPage from '../FlashCards/forms/flashcard_setup/questions';
import FlashcardFirstPart from './FlashCards';
import FlashCardStudySession from './FlashCards/FlashCardStudySession';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const transition = {
  duration: 0.3,
  ease: 'easeInOut'
};

const slideVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0%' },
  exit: { x: '100%' }
};

const SetUpFlashCards = ({ isAutomated }: { isAutomated?: boolean }) => {
  const { currentStep } = useFlashcardWizard();
  const steps: Step[] = [{ title: '' }, { title: '' }, { title: '' }];
  const formComponents = useMemo(
    () => [FlashcardFirstPart, FlashCardQuestionsPage, FlashCardStudySession],
    []
  );

  const CurrentForm = useMemo(
    () => formComponents[currentStep],
    [currentStep, formComponents]
  );

  const StyledTitle = styled.p`
    font-weight: 500;
    font-size: 1rem; // Default size for base

    // Media query for medium screens and above
    @media (min-width: 768px) {
      font-size: 1.125rem; // Larger size for md and above
    }
  `;

  return (
    <section>
      {currentStep === 0 && <StyledTitle>Set up flashcard</StyledTitle>}
      {currentStep === 1 && (
        <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>
          Review flashcard
        </p>
      )}
      <StepsIndicator steps={steps} activeStep={currentStep} />
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideVariants}
          transition={transition}
        >
          <CurrentForm isAutomated={isAutomated} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default SetUpFlashCards;
