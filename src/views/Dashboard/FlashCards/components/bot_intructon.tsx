import robot from '../../../../assets/robot.png';
import { CircleContainer } from '../../DocChat/styles';
import { Box, Flex, Image, HStack, Text, VStack } from '@chakra-ui/react';

const BotIntructionBox = () => {
  return (
    <Box bg="#F7F7F7" borderRadius="10px" p="20px" w="100%">
      <Flex w="100%" direction="column" align="flex-start">
        <HStack w="100%">
          <CircleContainer>
            <img
              style={{
                objectFit: 'cover',
                height: 'auto',
                width: '100%',
                borderRadius: '50%'
              }}
              alt=""
              src={
                'https://firebasestorage.googleapis.com/v0/b/shepherd-app-382114.appspot.com/o/assets%2Fscreenshot_2023-07-28_at_4.59.43_pm.jpg?alt=media&token=24b55940-12ec-427f-a8f4-76d79fc02d4f'
              }
            />
          </CircleContainer>
          <VStack ml={'50px'} spacing={2} align="flex-start">
            <Text
              fontWeight="500"
              fontSize="16px"
              lineHeight="21px"
              color="#212224"
            >
              Aristotle
            </Text>
            <Text
              fontWeight="400"
              fontSize="14px"
              lineHeight="16.94px"
              color="#585F68"
            >
              Questioner, ethicist, Flashcard Facilitator
            </Text>
          </VStack>
        </HStack>
        <Text
          marginTop="10px"
          fontWeight="600"
          fontSize="0.875rem"
          lineHeight="20px"
          color="#383D42"
        >
          Greetings, learner! I'm here to sharpen your mind with the power of
          repetition. Give me your material, and I will forge flashcards to
          stimulate your memory. Together, let's make your revision process a
          journey of self-discovery!"
        </Text>
      </Flex>
    </Box>
  );
};

export default BotIntructionBox;
