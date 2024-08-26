import StudyIcon from '../../../../assets/studyIcon.svg?react';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import { StudyContainer, StudyFirstLayer } from '../styles';
import React from 'react';

const FlashCardStudySession = () => {
  return (
    <StudyContainer>
      <StudyFirstLayer>
        <p>Your meddeck flashcard has been successfully created</p>
        <p>Flashcards have been saved to your flashcards</p>
      </StudyFirstLayer>
      <div style={{ marginTop: '20px' }}>
        <CustomButton
          isPrimary
          type="button"
          onClick={() => {
            return;
          }}
          title="Study"
          icon={<StudyIcon />}
        />
      </div>
    </StudyContainer>
  );
};

export default FlashCardStudySession;
