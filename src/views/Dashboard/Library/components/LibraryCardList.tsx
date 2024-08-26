import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import LoaderOverlay from '../../../../components/loaderOverlay';
import flashcardStore from '../../../../state/flashcardStore';
import libraryCardStore from '../../../../state/libraryCardStore';
// import userStore from '../../../../state/userStore';
import { LibraryCardData } from '../../../../types';
import LibraryCard from './LibraryCard';
import AddToDeckModal from './AddToDeckModal';
import { SimpleGrid, Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import SelectComponent, { Option } from '../../../../components/Select';
import { capitalize } from 'lodash';

const StyledImage = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  border: 0.6px solid #eaeaeb;
  box-shadow: 0 2px 10px rgba(63, 81, 94, 0.1);
`;

const YourFlashCardIcon = () => (
  <StyledImage marginRight="10px">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="10"
      height="14"
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  </StyledImage>
);

interface LibraryCardProps {
  deckId: string;
}

const LibraryCardList: React.FC<LibraryCardProps> = ({ deckId }) => {
  const { fetchLibraryCards, isLoading, pagination, libraryCards } =
    libraryCardStore();
  // const { user } = userStore();
  const { createFlashCard, editFlashcard } = flashcardStore();
  // State for tracking selected cards and modal visibility
  const [selectedCards, setSelectedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Option | null>(
    null
  );
  const toast = useCustomToast();

  const hasMore = pagination.page * pagination.limit < pagination.count;
  const loadMore = () => {
    const nextPage = pagination.page + 1;
    fetchLibraryCards(deckId, selectedDifficulty?.value || '', nextPage);
  };

  const difficulties: Option[] = [
    { value: '', label: 'All' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'very hard', label: 'Very Hard' }
  ];

  // useEffect(() => {
  //   fetchFlashcards()
  // },[fetchFlashcards])

  useEffect(() => {
    if (deckId) {
      fetchLibraryCards(deckId, selectedDifficulty?.value || '', 1);
    }
  }, [deckId, selectedDifficulty]);

  const onSubmitFlashcard = async (formData, selectedCards, isNewDeck) => {
    const questions = selectedCards.map((card) => {
      return {
        questionType: 'openEnded',
        question: card.front,
        answer: card.back,
        explanation: card.explanation || '',
        numberOfAttempts: 0,
        currentStep: 0,
        totalSteps: 0,
        currentStudy: null
      };
    });
    const data = {
      deckname: formData.deckname,
      studyType: formData.studyType,
      subject: selectedCards[0].subject.name,
      level: formData.level,
      topic: selectedCards[0].topic.name,
      studyPeriod: formData.studyPeriod,
      questions: questions,
      scores: [],
      source: 'shepherd' as const,
      currentStudy: null
    };
    try {
      if (isNewDeck) {
        const response = await createFlashCard(data, 'manual');
        if (response) {
          if (response.status === 200) {
            toast({
              title: 'Card saved to your flashcards',
              position: 'top-right',
              status: 'success',
              isClosable: true
            });
          } else {
            toast({
              title: 'Failed to save card, try again',
              position: 'top-right',
              status: 'error',
              isClosable: true
            });
          }
        }
      } else {
        const response = await editFlashcard(formData.selectedDeckId, data);
        if (response) {
          toast({
            title: `${data.deckname} updated`,
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
        } else {
          toast({
            title: `Failed to update ${data.deckname}, try again`,
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error) {
      toast({
        title: isNewDeck
          ? 'Failed to create flashcard, try again'
          : `Failed to updage ${data.deckname}, try again`,
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  };

  const options = (card: LibraryCardData) => [
    {
      label: 'Save',
      onClick: () => {
        // console.log('Save');
      },
      icon: <YourFlashCardIcon />
    }
  ];

  const handleCardSelect = (card, isSelected) => {
    setSelectedCards((prev) =>
      isSelected ? [...prev, card] : prev.filter((car) => car.id !== card.id)
    );
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFormSubmit = (formData, isNewDeck) => {
    onSubmitFlashcard(formData, selectedCards, isNewDeck);
    toggleModal();
  };

  const handleDifficultyChange = (option: Option) => {
    setSelectedDifficulty(option);
  };

  // if (isLoading && !libraryCards?.length) {
  //   return <LoaderOverlay />;
  // }
  return (
    <>
      {isModalOpen && (
        <AddToDeckModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onSubmit={handleFormSubmit}
        />
      )}
      <Flex justify="row" justifyContent="space-between" mb="4">
        {
          <Box width={{ base: '60%', sm: '50%', md: '40%', lg: '30%' }}>
            <SelectComponent
              placeholder="Filter by difficulty"
              options={difficulties}
              onChange={(option) => handleDifficultyChange(option as Option)}
              defaultValue={selectedDifficulty}
              isClearable
            />
          </Box>
        }
        {selectedCards.length > 0 && (
          <Button onClick={toggleModal}>Add to Deck</Button>
        )}
      </Flex>
      {libraryCards?.length ? (
        <InfiniteScroll
          dataLength={libraryCards.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<p></p>}
          endMessage={<p></p>}
          // style={{ overflow: 'hidden' }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={10}>
            {libraryCards.map((card) => (
              <LibraryCard
                key={card._id}
                question={card.front}
                difficulty={card.difficulty}
                answer={card.back}
                explanation={card.explainer}
                options={options(card)}
                onSelect={(isSelected) => handleCardSelect(card, isSelected)}
              />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          height={'calc(100vh - 350px)'}
        >
          <Box
            width={'100%'}
            display={'flex'}
            height="100%"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <img
              src="/images/empty_illustration.svg"
              alt="empty directory icon"
            />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              No cards to display
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default LibraryCardList;
