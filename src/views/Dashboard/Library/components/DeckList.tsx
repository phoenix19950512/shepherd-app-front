import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryDeckStore from '../../../../state/libraryDeckStore';
import Deck from './Deck';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryDeckProps {
  topicId: string;
  onSelectDeck: (deckId: string) => void;
}

const DeckList: React.FC<LibraryDeckProps> = ({ topicId, onSelectDeck }) => {
  const { fetchlibraryDecks, isLoading, libraryDecks } = libraryDeckStore();

  useEffect(() => {
    if (topicId) {
      fetchlibraryDecks(topicId);
    }
  }, [topicId, fetchlibraryDecks]);

  // if (isLoading && !libraryDecks?.length) {
  //   return <LoaderOverlay />;
  // }
  return !libraryDecks?.length ? (
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
        <img src="/images/empty_illustration.svg" alt="empty directory icon" />
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
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryDecks.map((deck) => (
        <Deck
          key={deck._id}
          data={{ name: deck.name }}
          onClick={() => onSelectDeck(deck._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default DeckList;
