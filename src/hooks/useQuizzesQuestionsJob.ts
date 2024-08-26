import { database } from '../firebase';
import {
  ref,
  onValue,
  off,
  DataSnapshot,
  remove,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import React, { useEffect, useState, useCallback } from 'react';
import { QuizQuestion } from '../types';

// type QuizQuestion = {
//   question: string;
//   questionType: string;
//   answer: string;
//   explanation: string;
// };

type Job = {
  documentId: string;
  quiz: QuizQuestion[];
};

function useQuizQuestionsJob(studentID: string) {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Function to watch new jobs for a documentId
  const watchJobs = useCallback(
    (
      documentId: string,
      callback?: (error: any, quiz?: QuizQuestion[]) => void
    ) => {
      const jobsRef = ref(database, `/quiz-job/${studentID}`);
      const documentIdQuery = query(
        jobsRef,
        orderByChild('documentId'),
        equalTo(documentId)
      );

      onValue(
        documentIdQuery,
        (snapshot: DataSnapshot) => {
          const jobsData: { [key: string]: Job } = snapshot.val() || {};

          const allQuizs: QuizQuestion[] = [];

          // Collect quiz from each job that matches the documentId
          Object.values(jobsData).forEach((job) => {
            if (job.documentId === documentId && job.quiz) {
              allQuizs.push(
                ...job.quiz.map((question) => ({
                  type: 'openEnded',
                  ...question
                }))
              );
            }
          });

          setQuizQuestions(allQuizs);
          if (callback) {
            callback(null, allQuizs);
          }
        },
        (error) => {
          callback && callback(error);
        }
      );
    },
    [studentID]
  );

  // Function to delete all jobs for a documentId
  const clearJobs = useCallback(
    (documentId: string) => {
      const jobsRef = ref(database, `/quiz-job/${studentID}`);
      const documentIdQuery = query(
        jobsRef,
        orderByChild('documentId'),
        equalTo(documentId)
      );

      onValue(
        documentIdQuery,
        (snapshot: DataSnapshot) => {
          const jobsData: { [key: string]: Job } = snapshot.val() || {};

          // Iterate over each job and delete it if it matches the documentId
          Object.keys(jobsData).forEach((jobKey) => {
            if (jobsData[jobKey].documentId === documentId) {
              remove(ref(database, `/quiz-job/${studentID}/${jobKey}`));
            }
          });
        },
        (error) => {
          // console.error('Firebase delete error:', error);
        }
      );
    },
    [studentID]
  );

  return {
    quizQuestions,
    watchJobs,
    clearJobs
  };
}

export default useQuizQuestionsJob;
