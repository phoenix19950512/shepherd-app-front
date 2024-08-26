import { memo, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../components/ui/dialog';
import ApiService from '../../../../../../../../services/ApiService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StudySessionHeader from './_components/header';
import StudySessionBody from './_components/body';

export interface StudySessionProps {
  open: boolean;
  id: string;
  close: () => void;
  setScore: (score: any) => void;
  score: any;
  setQuizOver: (quizOver: boolean) => void;
  quizOver: boolean;
  setOpenResults: (openResults: boolean) => void;
  resetForm?: () => void;
}

function StudySession({
  open,
  id,
  close,
  setScore,
  score,
  setQuizOver,
  quizOver,
  setOpenResults,
  resetForm
}: StudySessionProps) {
  const queryClient = useQueryClient();
  const [studySession, setStudySession] = useState({
    title: '',
    imageUrl: '',
    labels: []
  });

  const [sessionStarted, setSessionStarted] = useState({
    started: false,
    data: {}
  });

  const [answered, setAnswered] = useState(false);

  const { isSuccess, data, isFetching } = useQuery({
    queryKey: ['occlusion-card', id],
    queryFn: () => ApiService.getOcclusionCard(id).then((res) => res.json()),
    enabled: Boolean(id),
    select: (data) => data.card,
    refetchOnWindowFocus: false
  });

  const { mutate, isPending: isSubmittingQuiz } = useMutation({
    mutationFn: (data: { card: any; percentages: any }) =>
      ApiService.editOcclusionCard(data.card).then((res) => res.json())
  });

  const onItemClicked = (item: any) => {
    if (!sessionStarted.started) return;
    if (answered) return;
    setStudySession((prevState) => ({
      ...prevState,
      labels: prevState.labels.map((label: any) => {
        if (label.order === item.order) {
          return { ...label, isRevealed: true };
        }
        return label;
      })
    }));
    setAnswered(true);
  };

  const numberOfBubbledChecked = studySession?.labels.filter(
    (label: any) => !label.isRevealed
  ).length;

  const handleQuizOver = () => setQuizOver(numberOfBubbledChecked === 0);

  const updateScore = (key: 'right' | 'wrong' | 'notRemembered') => {
    setScore({ ...score, [key]: score[key] + 1 });
    setAnswered(false);
    handleQuizOver();
  };

  const setRight = () => updateScore('right');
  const setWrong = () => updateScore('wrong');
  const setNotRemembered = () => updateScore('notRemembered');

  useEffect(() => {
    if (isSuccess) {
      setStudySession(data);
    }
  }, [open, isSuccess, isFetching]);

  useEffect(() => {
    setScore({ right: 0, wrong: 0, notRemembered: 0 });
  }, [isFetching]);

  useEffect(() => {
    if (quizOver && open) {
      mutate(
        {
          card: {
            ...data,
            score: {
              passed: score.right,
              failed: score.wrong,
              notRemembered: score.notRemembered
            }
          },
          percentages: {}
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['image-occlusions']
            });
            setSessionStarted({ started: false, data: {} });
            close();
            setOpenResults(true);
          }
        }
      );
    }
  }, [quizOver]);

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white p-0 w-[740px] max-w-4xl">
        <StudySessionHeader
          {...{
            close,
            isFetching,
            isSubmittingQuiz,
            numberOfBubbledChecked,
            resetForm,
            sessionStarted,
            setOpenResults,
            setQuizOver,
            setSessionStarted,
            studySession
          }}
        />
        <StudySessionBody
          {...{
            isFetching,
            studySession,
            onItemClicked,
            sessionStarted,
            setSessionStarted,
            answered,
            setRight,
            setNotRemembered,
            setWrong
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default memo(StudySession);
