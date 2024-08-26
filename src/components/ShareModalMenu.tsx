import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Text,
  MenuItem
} from '@chakra-ui/react';
import React from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { copyTextToClipboard } from '../helpers/copyTextToClipboard';
import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';
import { RiShareForwardLine, RiTwitterXLine } from '@remixicon/react';
import { newId } from '../helpers/id';
import ApiService from '../services/ApiService';

type ShareModalMenuProps = {
  type: 'quiz' | 'note' | 'flashcard';
  id: string;
};
const appendParamsToUrl = (baseUrl, paramsToAppend) => {
  const url = new URL(baseUrl);
  const existingParams = new URLSearchParams(url.search);

  const paramsToExclude = ['shareable', 'apiKey'];

  paramsToExclude.forEach((param) => {
    existingParams.delete(param);
  });

  const updatedParams = new URLSearchParams([
    ...existingParams,
    ...paramsToAppend
  ]);

  url.search = updatedParams.toString();

  return url.toString();
};
const ShareModalMenu = ({ type, id }: ShareModalMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareLink, setShareLink] = useState('');
  const [presentableLink, setPresentableLink] = useState('');
  const toast = useCustomToast();
  const generateShareLink = () => {
    const apiKey = newId('shep');
    const baseURL = window.location.href.includes('quizzes')
      ? window.location.href + `/take?quiz_id=${id}`
      : window.location.href.includes('flashcards')
      ? window.location.href + `/${id}`
      : window.location.href + `/new-note/${id}`;
    const shareLink = appendParamsToUrl(
      baseURL,
      new URLSearchParams([
        ['shareable', 'true'],
        ['apiKey', apiKey]
      ])
    );
    setPresentableLink(shareLink.split('dashboard').at(-1));
    setShareLink(shareLink);
    setTimeout(() => {
      onOpen();
    }, 500);
  };
  const copyShareLink = useCallback(async () => {
    try {
      await copyTextToClipboard(shareLink);
      toast({
        title: 'Share Link Copied 🎊',
        description: 'Successfully copied custom share link',
        status: 'success',
        position: 'bottom-right'
      });
      const apiKey = shareLink.split('apiKey=').at(-1);
      await ApiService.generateShareLink({ apiKey });
    } catch (error) {
      toast({
        title: 'Something went wrong creating your share link',
        status: 'error',
        position: 'bottom-right'
      });
    }
  }, [shareLink, toast]);
  const shareOnX = useCallback(async () => {
    if (type === 'note') {
      const encodedTweetText = encodeURIComponent(
        'Check out my note on shepherd.study!  ' + shareLink
      );
      const tweetIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

      window.open(tweetIntentURL, '_blank');
      const apiKey = shareLink.split('apiKey=').at(-1);
      await ApiService.generateShareLink({ apiKey });
    } else if (type === 'quiz') {
      const encodedTweetText = encodeURIComponent(
        'Check out my quiz on shepherd.study! ' + shareLink
      );
      const tweetIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

      window.open(tweetIntentURL, '_blank');
      const apiKey = shareLink.split('apiKey=').at(-1);
      await ApiService.generateShareLink({ apiKey });
    } else {
      const encodedTweetText = encodeURIComponent(
        'Check out my flashcard on shepherd.study! ' + shareLink
      );
      const tweetIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

      window.open(tweetIntentURL, '_blank');
      const apiKey = shareLink.split('apiKey=').at(-1);
      await ApiService.generateShareLink({ apiKey });
    }
  }, [shareLink, type]);
  const modalContent = useMemo(() => {
    if (type === 'note') {
      return (
        <ModalContent>
          <ModalHeader>Share this Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex !items-start !justify-start flex-col  gap-3">
            <p>Anyone with this link can view your note.</p>
            <Input
              bg="transparent"
              outline="none"
              _focus={{ boxShadow: 'none' }}
              cursor="not-allowed"
              className="text-balance overflow-scroll"
              isDisabled
              value={presentableLink}
              padding="12px 24px"
              width={'100%'}
              boxShadow="inset 0 0 0 1px #f4f4f5"
              borderRadius="md"
            />
            <div className="flex gap-2">
              <Button
                onClick={copyShareLink}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <DocumentDuplicateIcon width={16} height={16} />
                <span> Copy link</span>
              </Button>
              <Button
                onClick={shareOnX}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <span> Share on </span>
                <RiTwitterXLine />
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      );
    } else if (type === 'quiz') {
      return (
        <ModalContent>
          <ModalHeader>Share this Quiz</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex !items-start !justify-start flex-col gap-3">
            <p>Anyone with this link can view your quiz.</p>
            <Input
              bg="transparent"
              outline="none"
              _focus={{ boxShadow: 'none' }}
              cursor="not-allowed"
              isDisabled
              className="text-balance overflow-scroll"
              value={presentableLink}
              padding="12px 24px"
              width={'100%'}
              boxShadow="inset 0 0 0 1px #f4f4f5"
              borderRadius="md"
            />
            <div className="flex gap-2">
              <Button
                onClick={copyShareLink}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <DocumentDuplicateIcon width={16} height={16} />
                <span> Copy link</span>
              </Button>
              <Button
                onClick={shareOnX}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <span> Share on </span>
                <RiTwitterXLine />
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      );
    } else {
      return (
        <ModalContent>
          <ModalHeader>Share this Flashcard</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex !items-start !justify-start flex-col  gap-3">
            <p>Anyone with this link can view your flashcard.</p>
            <Input
              bg="transparent"
              outline="none"
              _focus={{ boxShadow: 'none' }}
              cursor="not-allowed"
              className="text-balance overflow-scroll"
              isDisabled
              value={presentableLink}
              padding="12px 24px"
              width={'100%'}
              boxShadow="inset 0 0 0 1px #f4f4f5"
              borderRadius="md"
            />
            <div className="flex gap-2">
              <Button
                onClick={copyShareLink}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <DocumentDuplicateIcon width={16} height={16} />
                <span> Copy link</span>
              </Button>
              <Button
                onClick={shareOnX}
                bg="#f4f4f5"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="4px"
                padding="12px 24px"
                borderRadius="md"
                border="none"
                cursor="pointer"
                color="#000"
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                <span> Share on </span>
                <RiTwitterXLine />
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      );
    }
  }, [type, shareLink, copyShareLink, shareOnX]);
  return (
    <>
      <MenuItem
        p="6px 8px 6px 8px"
        display={'flex'}
        gap={3}
        onClick={generateShareLink}
        _hover={{ bgColor: '#F2F4F7' }}
      >
        <RiShareForwardLine />

        <Text
          color="#212224"
          fontSize="14px"
          lineHeight="20px"
          fontWeight="400"
        >
          Share
        </Text>
      </MenuItem>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        {modalContent}
      </Modal>
    </>
  );
};

export default ShareModalMenu;
