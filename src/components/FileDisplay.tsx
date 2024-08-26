import theme from '../theme';
import { Box, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FiFile, FiTrash } from 'react-icons/fi';
import styled from 'styled-components';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';

type Props = {
  file: File;
  onDeleteClicked?: React.MouseEventHandler<HTMLButtonElement>;
  uploading?: boolean;
  prefix?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Box>, 'prefix'>;

const Root = styled(Box)`
  padding-inline: var(--chakra-space-4);
  padding-block: var(--chakra-space-2);
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.gray[300]};
`;

const FileDisplay: React.FC<Props> = ({
  file,
  onDeleteClicked = null,
  uploading = false,
  prefix = null,
  ...rest
}) => {
  const formatFileSize = (size: number) => {
    if ((size + '').length < 7)
      return `${Math.round(+size / 1024).toFixed(2)}kb`;

    return `${(Math.round(+size / 1024) / 1000).toFixed(2)}MB`;
  };

  return (
    <Root {...rest}>
      <HStack>
        <HStack flexGrow={1} gap={1}>
          {uploading ? (
            <ShepherdSpinner />
          ) : prefix ? (
            prefix
          ) : (
            <FiFile style={{ flexShrink: 0 }} />
          )}
          <VStack spacing={0} alignItems="flex-start">
            <Text m={0} wordBreak={'break-word'}>
              {file.name}
            </Text>
            <Text variant={'muted'} m={0}>
              {formatFileSize(file.size)}
            </Text>
          </VStack>
        </HStack>
        {onDeleteClicked !== null && (
          <IconButton
            variant="ghost"
            aria-label="Delete file"
            onClick={onDeleteClicked}
            icon={<FiTrash />}
          />
        )}
      </HStack>
    </Root>
  );
};

export default FileDisplay;
