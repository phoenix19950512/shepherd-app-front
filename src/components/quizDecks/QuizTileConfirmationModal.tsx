import { LightningBoltIcon } from '../icons';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  Box,
  Button,
  VStack,
  HStack,
  Text
} from '@chakra-ui/react';

export const QuizModal = ({
  isOpen,
  closeOnOverlayClick = false,
  size = '400px',
  title = '',
  handleContinueQuiz = () => null,
  onClose = () => null,
  count = 0
}: {
  handleContinueQuiz?: () => void;
  title?: string;
  count?: number;
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
  handleRestartQuiz?: () => void;
  handleReviewQuiz?: () => void;
  scores?: {
    questionIdx: string | number;
    score: string | 'true' | 'false' | boolean | null;
    selectedOptions: string[];
  }[];
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'540px'} h={'380px'}>
        {/* <ModalCloseButton /> */}

        <ModalBody
          p={'0px'}
          pb={'0px'}
          // bg={false && '#E1EEFE'}
        >
          <Box
            h={'100%'}
            w={'100%'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            flexDirection={'column'}
          >
            <HStack justifyContent={'center'} mt={'auto'}>
              <Box>
                <svg
                  width="73"
                  height="72"
                  viewBox="0 0 73 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_2506_16927)">
                    <circle cx="36.5" cy="28" r="20" fill="white" />
                    <circle
                      cx="36.5"
                      cy="28"
                      r="19.65"
                      stroke="#EAEAEB"
                      stroke-width="0.7"
                    />
                  </g>
                  <path
                    d="M36.5002 37.1663C31.4376 37.1663 27.3335 33.0622 27.3335 27.9997C27.3335 22.9371 31.4376 18.833 36.5002 18.833C41.5627 18.833 45.6668 22.9371 45.6668 27.9997C45.6668 33.0622 41.5627 37.1663 36.5002 37.1663ZM35.5835 30.7497V32.583H37.4168V30.7497H35.5835ZM35.5835 23.4163V28.9163H37.4168V23.4163H35.5835Z"
                    fill="#F53535"
                  />
                  <defs>
                    <filter
                      id="filter0_d_2506_16927"
                      x="0.5"
                      y="0"
                      width="72"
                      height="72"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="8" />
                      <feGaussianBlur stdDeviation="8" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.32 0 0 0 0 0.389333 0 0 0 0 0.48 0 0 0 0.11 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2506_16927"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2506_16927"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </Box>
            </HStack>
            <VStack
              w={'100%'}
              // h={'70%'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box>
                <Text
                  fontSize={'18px'}
                  lineHeight={'21px'}
                  fontFamily={'Inter'}
                  color={'text.800'}
                  textAlign={'center'}
                  fontWeight={'400'}
                >
                  You have{' '}
                  <Text as={'span'} fontWeight={'bold'}>
                    {count || 0}
                  </Text>{' '}
                  quiz question{count > 1 ? 's' : ''}, unanswered <br />
                  do still want to submit the{' '}
                  <Text as={'span'} fontWeight={'bold'}>
                    {title}
                  </Text>{' '}
                  quiz?
                </Text>
              </Box>
            </VStack>
            <HStack
              w={'100%'}
              justifyContent={'flex-end'}
              py={'24px'}
              px={'16px'}
              bg={'#F7F7F8'}
              mt={'auto'}
            >
              <Button
                w={'30%'}
                h={'40px'}
                borderRadius="8px"
                fontSize="14px"
                lineHeight="20px"
                variant="solid"
                onClick={onClose}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
                bg={'#fff'}
                textColor={'#5C5F64'}
                _hover={{ opacity: 0.7 }}
              >
                Submit Anyway
              </Button>

              <Button
                w={'30%'}
                h={'40px'}
                borderRadius="8px"
                fontSize="14px"
                lineHeight="20px"
                variant="solid"
                onClick={handleContinueQuiz}
                display={'flex'}
                flexDirection={'row'}
                justifyContent={'center'}
              >
                Continue Quiz
              </Button>
            </HStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
