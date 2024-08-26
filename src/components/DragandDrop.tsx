import React, { useEffect, useState } from 'react';
import { Box, Text, Icon, Spinner, BoxProps, Progress } from '@chakra-ui/react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

interface DragAndDropProps extends BoxProps {
  accept?: string;
  boxStyles?: BoxProps;
  supportingText?: string;
  isLoading?: boolean;
  file?: File | string | undefined;
  onDelete?: () => void;
  onFileUpload: (file: File) => void;
  maxSize?: string;
  progress?: number;
  countdown?: {
    active: boolean;
    message: string;
  };
  setProgress?: any;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  accept,
  supportingText,
  onFileUpload,
  file,
  onDelete,
  isLoading = false,
  maxSize,
  progress,
  countdown,
  setProgress,
  ...rest
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSelected, setFileSelected] = useState(false);
  const [error, setError] = useState('');

  const parseSize = (sizeStr) => {
    const units = sizeStr.slice(-2);
    const value = parseInt(sizeStr.slice(0, -2), 10);
    const sizes = { kb: 1024, mb: 1024 * 1024 };
    return value * sizes[units.toLowerCase()];
  };

  useEffect(() => {
    if (file) {
      const fileName =
        typeof file === 'object'
          ? file.name
          : decodeURIComponent(new URL(file).pathname).split('/').pop();
      setFileSelected(true);
      setFileName(fileName as string);
    } else if (!file) {
      setFileSelected(false);
      setFileName('');
    }
  }, [file, fileSelected, fileName]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && accept && file.type.match(accept)) {
      if (maxSize && file.size > parseSize(maxSize)) {
        setError(`File size exceeds ${maxSize}`);
        return;
      }
      onFileUpload(file);
      setFileSelected(true);
      setFileName(file.name);
      setError('');
    }
  };

  const handleClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept || '';
    fileInput.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        if (maxSize && files[0].size > parseSize(maxSize)) {
          setError(`File size exceeds ${maxSize}`);
          return;
        }
        onFileUpload(files[0]);
        setFileSelected(true);
        setFileName(files[0].name);
        setError('');
      }
    };
    fileInput.click();
  };

  return (
    <Box
      width="100%"
      border="2px dashed"
      borderColor={error ? 'red.500' : '#E4E5E7'}
      borderRadius={5}
      minHeight={'100px'}
      padding="30px"
      textAlign="center"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      bg={isDragging || fileSelected ? '#F0F6FE' : 'transparent'}
      cursor="pointer"
      {...rest}
    >
      {isLoading ? (
        <Spinner color="blue.500" />
      ) : fileSelected ? (
        <Icon
          as={FiTrash2}
          boxSize={8}
          color="red.500"
          onClick={() => onDelete && onDelete()}
        />
      ) : (
        <Icon as={FiUpload} boxSize={8} color="gray.500" />
      )}
      <Text fontSize="base" mt={3} fontWeight="500">
        {fileSelected
          ? 'File Selected'
          : 'Drag file here to upload or choose file'}
      </Text>
      <Text fontSize="sm" color={error ? 'red.500' : 'gray.500'} mt={2}>
        {error
          ? error
          : supportingText
          ? supportingText
          : 'Supports PDF formats'}
      </Text>
      {fileName && <Box color={error ? 'red.500' : 'blue.500'}>{fileName}</Box>}
    </Box>
  );
};

export default DragAndDrop;
