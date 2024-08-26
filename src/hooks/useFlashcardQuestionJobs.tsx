import { database } from '../firebase';
import { ref, onValue, DataSnapshot, remove, off } from 'firebase/database';
import { useEffect, useState, useCallback } from 'react';

type FlashcardQuestion = {
  question: string;
  questionType: string;
  answer: string;
  explanation: string;
};
type Job = {
  documentId: string;
  flashcards: FlashcardQuestion[];
};
function useFlashcardQuestionsJob(studentID: string) {
  const [flashcardQuestions, setFlashcardQuestions] = useState<
    FlashcardQuestion[]
  >([]);
  // Function to watch new jobs for a documentId
  const watchJobs = useCallback(
    (
      jobId: string,
      callback?: (error: any, flashcards?: FlashcardQuestion[]) => void
    ) => {
      const jobRef = ref(database, `/flashcard-job/${studentID}/${jobId}`);
      onValue(
        jobRef,
        (snapshot: DataSnapshot) => {
          const jobData: Job | null = snapshot.val();

          if (jobData && jobData.flashcards) {
            const allFlashcards: FlashcardQuestion[] = jobData.flashcards.map(
              (question: any) => ({
                ...question,
                questionType: 'openEnded'
              })
            );

            if (allFlashcards.length) {
              setFlashcardQuestions(allFlashcards);
            }

            if (callback) {
              callback(null, allFlashcards);
              off(jobRef);
              // remove(jobRef);
            }
          }

          // else if (callback) {
          //   callback(null, []); // No data found
          // }
        },
        (error: any) => {
          if (callback) {
            callback(error.message);
          }
        }
      );
    },
    [studentID]
  );
  // Function to delete all jobs for a documentId
  const clearJobs = useCallback(
    (documentId: string) => {
      const jobsRef = ref(database, `/flashcards-job/${studentID}`);

      remove(jobsRef)
        .then(() => {
          setFlashcardQuestions([]);
        })
        .catch((error) => {
          console.error('Error clearing jobs:', error);
        });
    },
    [studentID]
  );
  return {
    flashcardQuestions,
    watchJobs,
    clearJobs
  };
}
export default useFlashcardQuestionsJob;
