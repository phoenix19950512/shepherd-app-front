import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import quizStore from '../../../state/quizStore';
import { QuizData, QuizQuestion } from '../../../types';
import { QuizPreview as QuizPreviewer } from './previews';
import { Box, Flex } from '@chakra-ui/react';
import { isEmpty, isNil, map, merge } from 'lodash';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './styles.css';
import { firebaseAuth } from '../../../firebase';

type NewQuizQuestion = QuizQuestion & {
  canEdit?: boolean;
};

const CreateQuizPage = () => {
  const [searchParams] = useSearchParams();
  const toast = useCustomToast();
  const { isLoading, fetchQuizzes, handleIsLoadingQuizzes } = quizStore();
  const [quizId, setQuizId] = useState<string | null | undefined>(null);

  const [questions, setQuestions] = useState<NewQuizQuestion[]>([]);

  const [title, setTitle] = useState('');
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const navigate = useNavigate();
  const apiKey = searchParams.get('apiKey');
  const shareable = searchParams.get('shareable');
  useEffect(() => {
    const queryQuizId = searchParams.get('quiz_id');

    if (!isEmpty(queryQuizId) && !isNil(queryQuizId)) {
      (async () => {
        if (
          !isEmpty(apiKey) &&
          !isNil(apiKey) &&
          !isEmpty(shareable) &&
          !isNil(shareable)
        ) {
          try {
            handleIsLoadingQuizzes(true);
            const result: any = await ApiService.getQuizForAPIKey(
              queryQuizId as string,
              apiKey
            );
            const { data }: { data: QuizData } = await result.json();

            if (data) {
              setQuizId(queryQuizId);
              setTitle(data.title);
              setQuestions(
                map(data?.questions, (question) =>
                  merge({}, question, { canEdit: true })
                )
              );
            }
          } catch (error) {
            toast({
              position: 'top-right',
              title: `failed to fetch quiz`,
              status: 'error'
            });
          } finally {
            handleIsLoadingQuizzes(false);
          }

          window.addEventListener('click', () => {
            setTogglePlansModal(true);
          });

          // document.body.style.userSelect = 'none';
          // document.body.style.pointerEvents = 'none';

          // const excludeSection: HTMLDivElement | null =
          //   document.querySelector('.pm');
          // if (excludeSection) {
          //   excludeSection.style.userSelect = 'auto';
          //   excludeSection.style.pointerEvents = 'auto';

          //   const descendants: Array<HTMLElement> = Array.from(
          //     excludeSection.querySelectorAll('*')
          //   );
          //   descendants.forEach((descendant) => {
          //     descendant.style.userSelect = 'auto';
          //     descendant.style.pointerEvents = 'auto';
          //   });
          // }
          return;
        } else {
          const token = await firebaseAuth.currentUser?.getIdToken();

          if (!token) {
            navigate('/signup');
          }
        }
        try {
          handleIsLoadingQuizzes(true);
          const result: any = await ApiService.getQuiz(queryQuizId as string);
          const { data }: { data: QuizData } = await result.json();

          if (data) {
            setQuizId(queryQuizId);
            setTitle(data.title);
            setQuestions(
              map(data?.questions, (question) =>
                merge({}, question, { canEdit: true })
              )
            );
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('getQuiz Error =========>> ', error);
          }

          toast({
            position: 'top-right',
            title: `failed to fetch quiz`,
            status: 'error'
          });
        } finally {
          handleIsLoadingQuizzes(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchQuizzes, handleIsLoadingQuizzes, searchParams]);
  if (apiKey) {
    const inputElements = document.querySelectorAll('input');

    const textAreas = document.querySelectorAll('textarea');
    if (inputElements && textAreas) {
      // Disable each input element on the page
      inputElements.forEach((input) => {
        input.disabled = true;
        input.style.userSelect = 'none';
      });
      textAreas.forEach((input) => {
        input.disabled = true;
        input.style.userSelect = 'none';
      });
    }
  }
  return (
    <>
      <Flex
        className="quiz-page-wrapper"
        width={'100%'}
        height={'100vh'}
        maxH={'calc(100vh - 80px)'}
        overflowY={'hidden'}
        flexWrap="wrap"
      >
        <Box
          className="review-quiz-wrapper"
          width={['100%']}
          bg="#F9F9FB"
          borderLeft="1px solid #E7E8E9"
        >
          {/* {isLoading && <LoaderOverlay />} */}

          <QuizPreviewer
            apiKey={apiKey}
            title={title}
            questions={questions}
            quizId={quizId as string}
            togglePlansModal={togglePlansModal}
            setTogglePlansModal={setTogglePlansModal}
          />
        </Box>
      </Flex>
    </>
  );
};

const TakeQuiz = () => {
  return <CreateQuizPage />;
};

export default TakeQuiz;
