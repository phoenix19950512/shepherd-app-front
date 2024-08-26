import MnemonicCard from '../components/mneomics_preview_card';
import OptionBadge from '../components/optionBadge';
import { useMnemonicSetupState } from '../context/mneomics';
import { TypeEnum } from '../create';
import { Box, Button, HStack, Text, VStack, Flex } from '@chakra-ui/react';
import React, { useMemo } from 'react';

export default function MnemonicPreview({
  activeBadge,
  handleBadgeClick
}: {
  activeBadge?: TypeEnum;
  handleBadgeClick: (v: TypeEnum) => void;
}) {
  const { mnemonics, saveMneomics, isLoading } = useMnemonicSetupState();

  const readyMneomics = useMemo(
    () => mnemonics.filter((m) => m.answer && m.explanation),
    [mnemonics]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      bg="#F8F9FB"
      p="40px"
    >
      <Flex
        position="sticky"
        top="0"
        justifyContent="space-between"
        alignItems="center"
        bg="#F8F9FB"
        zIndex="1"
        paddingBottom="20px"
      >
        <HStack spacing="20px">
          <OptionBadge
            text="Flashcards"
            icon={(isActive) => {
              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                  color={isActive ? '#FFFFFF' : '#6E7682'}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              );
            }}
            isActive={activeBadge === TypeEnum.FLASHCARD}
            onClick={() => handleBadgeClick(TypeEnum.FLASHCARD)}
          />
          <OptionBadge
            text="Mnemonics"
            icon={(isActive) => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                color={isActive ? '#FFFFFF' : '#6E7682'}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            )}
            isActive={activeBadge === TypeEnum.MNEOMONIC}
            onClick={() => handleBadgeClick(TypeEnum.MNEOMONIC)}
          />
        </HStack>
        <Button
          isLoading={isLoading}
          disabled={readyMneomics.length < 1}
          onClick={() => saveMneomics()}
          borderRadius="10px"
          p="10px 25px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
        >
          Confirm
        </Button>
      </Flex>

      <Box
        flex="1"
        overflowY="scroll"
        paddingBottom="100px"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          maskImage: 'linear-gradient(to bottom, black 90%, transparent)'
        }}
      >
        <VStack spacing={10} width={'100%'}>
          {readyMneomics.map((mneomics) => (
            <MnemonicCard
              answer={mneomics.answer}
              explanation={mneomics.explanation}
            />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
