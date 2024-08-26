import { useMnemonicSetupState } from '../../context/mneomics';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  HStack,
  Text
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ChangeEvent, useEffect, useMemo } from 'react';

interface IInput {
  labelInput: string;
}

const MnemonicSetup: React.FC = () => {
  const {
    mnemonics,
    addMnemonic,
    updateMnemonic,
    generateMneomics,
    isLoading
  } = useMnemonicSetupState();

  const isValid = useMemo(() => mnemonics.every((m) => m.prompt), [mnemonics]);

  useEffect(() => {
    if (mnemonics?.length < 1) {
      addMnemonic({ prompt: '', answer: '', explanation: '' });
    }
    /* eslint-disable */
  }, [mnemonics]);

  const handleInputChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;
    updateMnemonic(index, { ...mnemonics[index], prompt: value });
  };

  const handleAddInput = () => {
    addMnemonic({ prompt: '', answer: '', explanation: '' });
  };

  return (
    <Box bg="white" width="100%">
      <FormControl>
        <FormLabel
          fontSize="18px"
          fontWeight="500"
          mb="5px"
          lineHeight="23px"
          color="#212224"
        >
          Generate Mnemonic device
        </FormLabel>
        <FormLabel
          fontSize="14px"
          w={'70%'}
          marginBottom="25px"
          fontWeight="400"
          lineHeight="20px"
          color="#585F68"
        >
          This helps you to recall information more easily by associating with
          something more familiar
        </FormLabel>
      </FormControl>

      <AnimatePresence>
        {mnemonics.map((x, i: number) => {
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <FormControl mb={'20px'}>
                <FormLabel
                  fontSize="12px"
                  fontWeight="500"
                  lineHeight="17px"
                  color="#5C5F64"
                  mb={3}
                >
                  Input
                </FormLabel>
                <Textarea
                  minH="105px"
                  name="labelInput"
                  placeholder="e.g Create a mnemonic device for remembering the names of amino acids"
                  value={x.prompt}
                  onChange={(e) => handleInputChange(e, i)}
                  _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                />
              </FormControl>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <Button
        aria-label="Edit"
        height={'fit-content'}
        width={'fit-content'}
        variant="unstyled"
        fontWeight={500}
        fontSize={'12px'}
        p={0}
        color={'#207DF7'}
        _hover={{ bg: 'none', padding: '0px' }}
        _active={{ bg: 'none', padding: '0px' }}
        _focus={{ boxShadow: 'none' }}
        colorScheme="primary"
        onClick={handleAddInput}
      >
        + Add More
      </Button>
      <HStack w="full" align={'flex-end'}>
        <Button
          variant="solid"
          isDisabled={!isValid}
          isLoading={isLoading}
          colorScheme="primary"
          size="sm"
          ml="auto"
          fontSize={'14px'}
          mt={10}
          padding="20px 25px"
          onClick={() => generateMneomics()}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            style={{ marginRight: '10px' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6862 10.9228L8.84226 14.7979C8.72359 15.0473 8.42526 15.1533 8.17592 15.0346C8.12034 15.0082 8.07009 14.9717 8.02776 14.9269L5.07658 11.8113C4.99758 11.7279 4.89228 11.6743 4.77838 11.6594L0.52314 11.1032C0.249323 11.0673 0.0563729 10.8164 0.0921646 10.5426C0.10014 10.4815 0.119331 10.4225 0.148756 10.3684L2.19993 6.59893C2.25484 6.49801 2.27333 6.38126 2.25229 6.26835L1.46634 2.0495C1.41576 1.77803 1.59484 1.51696 1.86631 1.46638C1.92684 1.45511 1.98893 1.45511 2.04946 1.46638L6.26831 2.25233C6.38126 2.27337 6.49801 2.25488 6.59884 2.19998L10.3683 0.1488C10.6109 0.0168086 10.9146 0.106442 11.0465 0.349C11.076 0.403084 11.0952 0.462134 11.1031 0.523184L11.6593 4.77842C11.6743 4.89233 11.7279 4.99763 11.8113 5.07662L14.9269 8.02776C15.1274 8.21768 15.136 8.53418 14.9461 8.73459C14.9038 8.77934 14.8535 8.81584 14.7979 8.84226L10.9228 10.6862C10.8191 10.7356 10.7355 10.8191 10.6862 10.9228ZM11.3502 12.5288L12.5287 11.3503L16.0643 14.8858L14.8858 16.0643L11.3502 12.5288Z"
              fill="white"
            />
          </svg>
          {/* <Image
            boxSize="40px"
            objectFit="cover"
            alt=""
            src={require("../../../../../assets/magic-wand.png")}
          /> */}
          Generate
        </Button>
      </HStack>
    </Box>
  );
};

export default MnemonicSetup;
