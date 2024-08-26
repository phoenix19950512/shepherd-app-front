import { useState, useEffect } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { executeCode } from './api';
import useKeyPress from '../hooks/useKeyPress';
import { useCustomToast } from '../../../../../components/CustomComponents/CustomToast/useCustomToast';
import theme from '../../../../../theme';

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const enterPress = useKeyPress('Enter');
  const ctrlPress = useKeyPress('Control');

  const toast = useCustomToast();

  const showSuccessToast = () => {
    toast({
      title: `Compiled Successfully!`,
      status: 'success',
      position: 'top-right',
      isClosable: true
    });
  };

  const showErrorToast = (error) => {
    toast({
      title: 'An error occurred.',
      description: error.message || 'Unable to run code',
      status: 'error',
      duration: 6000,
      position: 'top-right'
    });
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      showSuccessToast();
      setOutput(result.output.split('\n'));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      runCode();
    }
  }, [ctrlPress, enterPress]);

  return (
    <Box w="full">
      <h4 className="font-medium text-sm mb-2">Output</h4>

      <Button
        variant="outline"
        color="primary.400"
        borderColor="primary.400"
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
        size="sm"
      >
        {isLoading ? 'Running...' : 'Run Code'}
      </Button>
      <Box
        p={4}
        color={isError ? 'red.500' : 'gray.800'}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? 'red.500' : 'gray.300'}
        minHeight="100px"
        overflow="auto"
        whiteSpace="pre-wrap"
        backgroundColor={isError ? 'red.50' : 'white'}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
