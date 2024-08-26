import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';

export const DeletePayModal = ({
  isOpen,
  onCancel,
  onDelete,
  //   isLoading,
  onClose
}: {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onClose: () => void;
  //   isLoading: boolean;
}) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent
        minWidth={{ base: '80%', md: '500px' }}
        mx="auto"
        w="fit-content"
        borderRadius="10px"
      >
        <ModalBody alignItems={'center'} justifyContent={'center'}>
          <Flex
            flexDirection="column"
            justifyContent={'center'}
            padding={'40px'}
            alignItems="center"
          >
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
            <Text
              fontSize="18px"
              fontFamily="Inter"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              marginBottom={'10px'}
              letterSpacing="0.112px"
              color="#212224"
            >
              Delete payment method?
            </Text>
            <Text
              color="#6E7682"
              textAlign="center"
              fontSize="14px"
              fontFamily="Inter"
              width={'80%'}
              fontStyle="normal"
              fontWeight="400"
              lineHeight="20px"
            >
              This will permanently remove this payment method from your list.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p="16px"
          justifyContent="flex-end"
        >
          <Button
            // disabled={isLoading}
            _hover={{
              backgroundColor: '#FFF',
              boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
            }}
            color="#5C5F64"
            fontSize="14px"
            fontFamily="Inter"
            fontWeight="500"
            lineHeight="20px"
            onClick={() => onCancel()}
            borderRadius="8px"
            border="1px solid #E7E8E9"
            bg="#FFF"
            boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
            mr={3}
          >
            Cancel
          </Button>

          {/* {isLoading ? (
            <Button
              _hover={{
                backgroundColor: '#F53535'
              }}
              colorScheme="grey"
              onClick={() => onDelete()}
              color="#ffffff"
              borderRadius="6px"
              px="16px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              isLoading={isLoading}
              loadingText="Deleting..."
            >
              Submit
            </Button>
          ) : ( */}
          <Button
            colorScheme="blue"
            _hover={{
              backgroundColor: '#F53535'
            }}
            onClick={() => onDelete()}
            color="#ffffff"
            borderRadius="6px"
            px="16px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            // isLoading={isLoading}
          >
            Submit
          </Button>
          {/* )} */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
