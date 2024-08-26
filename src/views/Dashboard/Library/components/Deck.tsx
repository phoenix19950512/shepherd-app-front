import React from 'react';
import { Box, Flex, Text, Image } from '@chakra-ui/react';

interface DeckProps {
  data: {
    name: string;
  };
  onClick: () => void;
}

function extractTopicFromDeckName(deckName) {
  const prefix = "Shepherd's ";
  const suffix = ' deck';
  const topicName = deckName.replace(prefix, '').replace(suffix, '');
  return topicName;
}

const Deck: React.FC<DeckProps> = ({ data, onClick }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        onClick={handleCardClick}
        cursor="pointer"
      >
        <Box position="relative" height="300px">
          <Image
            src="/images/deck-image.png"
            alt={`${data.name} deck thumbnail`}
            objectFit="cover"
            width="full"
            height="full"
            cursor="pointer"
            onClick={handleCardClick}
          />
          <Box
            position="absolute"
            top="10%"
            left="20%"
            width="60%"
            height="60%"
            overflow="hidden"
            p="4"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Text fontSize="sm" fontFamily={'inter'} noOfLines={6}>
              {`Our curated questions and answers about ${extractTopicFromDeckName(
                data.name
              )}`}
            </Text>
          </Box>
        </Box>
        <Flex p="4" align="center" justify="space-between">
          <Box flex="1" cursor="pointer">
            <Text fontWeight="bold">{data.name}</Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Deck;
