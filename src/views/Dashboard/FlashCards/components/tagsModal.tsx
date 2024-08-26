import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack
} from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react';

interface TagModalProps {
  tags: string[];
  onSubmit: (tags: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TagModal: React.FC<TagModalProps> = ({
  tags,
  onSubmit,
  isOpen,
  onClose
}) => {
  const [inputValue, setInputValue] = useState('');
  const [hasLoadedDefaultTags, setHasLoadedDefaultTags] = useState(false);
  const [newTags, setNewTags] = useState<string[]>(tags);

  useEffect(() => {
    if (tags.length && !hasLoadedDefaultTags) {
      setNewTags(tags);
      setHasLoadedDefaultTags(true);
    }
  }, [tags, hasLoadedDefaultTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(inputValue)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewTags(newTags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    onSubmit(newTags);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Tag</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={'0px'}>
          <VStack width={'full'}>
            <FormControl mt="20px">
              <Input
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                placeholder="Add a tag and press enter"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleAddTag();
                    event.preventDefault(); // To prevent form submission
                  }
                }}
              />
            </FormControl>
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems={'start'}
              width="100%"
              marginTop="10px"
              justifyItems={'start'}
            >
              {newTags.map((tag) => (
                <Tag
                  key={tag}
                  borderRadius="5"
                  background="#f7f8fa"
                  mr="5px"
                  mb="5px"
                  p="10px 20px"
                >
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              ))}
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TagModal;
