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
  Box,
  List,
  ListItem,
  VStack,
  Checkbox,
  extendTheme,
  ChakraProvider,
  HStack
} from '@chakra-ui/react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { copyTextToClipboard } from '../helpers/copyTextToClipboard';
import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';
import { RiShareForwardLine, RiTwitterXLine } from '@remixicon/react';
import { newId } from '../helpers/id';
import { debounce } from 'lodash';

// import {
//   MultiSelect,
//   MultiSelectProps,
//   MultiSelectTheme,
//   SelectionVisibilityMode,
//   useMultiSelect
// } from 'chakra-multiselect';
import { MultiSelect } from 'react-multi-select-component';

import ApiService from '../services/ApiService';
import useResourceStore from '../state/resourceStore';
import clientStore from '../state/clientStore';

interface Item {
  id: string;
  name: string;
}

interface SearchableListProps {
  items: Item[];
  checkedIds?: string[];
  onItemCheck: (id: string) => void;
  onAllCheck: (checked: boolean) => void;
}

const SearchableList: React.FC<SearchableListProps> = ({
  items,
  checkedIds = [],
  onItemCheck,
  onAllCheck
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const allChecked = checkedIds.length === items.length;

  useEffect(() => {
    const debouncedSearch = debounce(filterItems, 300);
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleItemCheck = (id: string) => {
    onItemCheck(id);
  };

  const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAllCheck(event.target.checked);
  };

  const filterItems = (term: string) => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  };

  return (
    <Box width="100%" overflow="hidden">
      <VStack spacing={4}>
        <HStack w="full">
          <Checkbox
            isChecked={allChecked}
            onChange={handleAllCheck}
            aria-label="Select all items"
          />

          <Input
            height={'12px'}
            _placeholder={{ fontSize: '12px' }}
            placeholder={`Search students to share with...`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </HStack>

        <Box
          width="100%"
          maxHeight="200px"
          overflowY="scroll"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
              background: '#F7FAFC'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CBD5E0',
              borderRadius: '2px'
            }
          }}
        >
          <List spacing={2}>
            {filteredItems.map((item) => (
              <ListItem key={item.id}>
                <Checkbox
                  fontSize={'8px'}
                  width="full"
                  borderBottom={'1px solid #E4E6E7'}
                  isChecked={checkedIds.includes(item.id)}
                  onChange={() => handleItemCheck(item.id)}
                >
                  <Text fontSize={'14px'}> {item.name}</Text>
                </Checkbox>
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Box>
  );
};

type ShareModalProps = {
  type:
    | 'quiz'
    | 'note'
    | 'flashcard'
    | 'docchat'
    | 'aichat'
    | 'tutor'
    | 'school'
    | 'studyPlan';
  customTriggerComponent?: React.ReactNode;
  prefferredBaseUrl?: string;
  shareList?: { id: string; name: string }[];
  permissionBasis?: 'school';
};

interface ModalContentLayoutProps {
  headerTitle: string;
  bodyText: string;
  presentableLink: string;
  copyShareLink: () => void;
  shareOnX: () => void;
}

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
const ShareModal = ({
  type,
  customTriggerComponent,
  prefferredBaseUrl,
  shareList,
  permissionBasis
}: ShareModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareLink, setShareLink] = useState('');
  const [presentableLink, setPresentableLink] = useState('');
  const toast = useCustomToast();

  const generateShareLink = () => {
    const apiKey = newId('shep');
    const url = prefferredBaseUrl || window.location.href;
    const shareLink = appendParamsToUrl(
      window.location.href,
      new URLSearchParams([
        ['shareable', 'true'],
        ['apiKey', apiKey]
      ])
    ).replace('/tutordashboard', '');
    setPresentableLink(shareLink.split('dashboard').at(-1));
    setShareLink(shareLink);
    setTimeout(() => {
      onOpen();
    }, 500);
  };

  const generateMultipleShareLinks = (
    userIds: string[]
  ): { shareLink: string; apiKey: string; userId: string }[] => {
    return userIds.map((userId) => {
      const apiKey = newId('shep');
      const url = prefferredBaseUrl || window.location.href;
      const shareLink = appendParamsToUrl(
        window.location.href,
        new URLSearchParams([
          ['shareable', 'true'],
          ['apiKey', apiKey]
        ])
      ).replace('/tutordashboard', '');
      return { shareLink, apiKey, userId };
    });
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

  const forwardToUsers = useCallback(async (userIds: string[]) => {
    try {
      const forwardList = generateMultipleShareLinks(userIds);
      const { ok } = await ApiService.generateShareLink({
        forwardList,
        permissionBasis,
        shareType: type
      });
      if (ok) {
        toast({
          title: 'Share Link Shared with users 🎊',
          description: 'Successfully shared link',
          status: 'success',
          position: 'bottom-right'
        });
      } else {
        toast({
          title: 'Something went wrong creating your share link',
          status: 'error',
          position: 'bottom-right'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Something went wrong creating your share link',
        status: 'error',
        position: 'bottom-right'
      });
    }
  }, []);

  const shareOnX = useCallback(async () => {
    let tweetBaseText = '';

    switch (type) {
      case 'note':
        tweetBaseText = 'Check out my note on shepherd.study!';
        break;
      case 'quiz':
        tweetBaseText = 'Check out my quiz on shepherd.study!';
        break;
      case 'aichat':
      case 'docchat':
        tweetBaseText = 'Check out my conversation on shepherd.study!';
        break;
      case 'studyPlan':
        tweetBaseText = 'Check out my study plan on shepherd.study!';
        break;
      default:
        tweetBaseText = 'Book a session!';
        break;
    }

    const encodedTweetText = encodeURIComponent(
      `${tweetBaseText} ${shareLink}`
    );
    const tweetIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    window.open(tweetIntentURL, '_blank');
    const apiKey = shareLink.split('apiKey=').at(-1);
    await ApiService.generateShareLink({ apiKey });
  }, [shareLink, type]);

  const modalContent = useMemo(() => {
    const headerTitles = {
      note: 'Share this Note',
      quiz: 'Share this Quiz',
      aichat: 'Share this Conversation',
      docchat: 'Share this Conversation',
      tutor: 'Share this Tutor',
      studyPlan: 'Share this Study Plan'
    };

    const bodyTexts = {
      note: 'Anyone with this link can view your note.',
      quiz: 'Anyone with this link can view your quiz.',
      aichat: 'Anyone with this link can view your conversation.',
      docchat:
        'Anyone with this link can view your conversation with your document.',
      tutor: 'Anyone with this link can view this tutor.',
      studyPlan: 'Anyone with this link can view this study plan.'
    };

    return (
      <ModalContentLayout
        shareList={shareList}
        headerTitle={headerTitles[type]}
        bodyText={bodyTexts[type]}
        presentableLink={presentableLink}
        copyShareLink={copyShareLink}
        shareOnX={shareOnX}
        forwardToUsers={forwardToUsers}
      />
    );
  }, [type, presentableLink, copyShareLink, forwardToUsers, shareOnX]);

  return (
    <>
      {customTriggerComponent ? (
        <div onClick={generateShareLink}>{customTriggerComponent}</div>
      ) : type === 'docchat' ? (
        <Button
          onClick={generateShareLink}
          bg="#f4f4f5"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="4px"
          padding="10px"
          borderRadius="md"
          border="none"
          cursor="pointer"
          color="#000"
          _hover={{ bg: '#e4e4e5' }}
          _active={{ bg: '#d4d4d5' }}
        >
          <RiShareForwardLine />
        </Button>
      ) : (
        <Button
          onClick={generateShareLink}
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
          <span> Share</span>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
        </Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        {modalContent}
      </Modal>
    </>
  );
};

const ModalContentLayout = ({
  headerTitle,
  bodyText,
  presentableLink,
  copyShareLink,
  shareOnX,
  shareList,
  forwardToUsers
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  return (
    <ModalContent>
      <ModalHeader>{headerTitle}</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        pt="10px"
        p="0"
        px="24px"
        className="flex !items-start !justify-start flex-col gap-3"
      >
        <p>{bodyText}</p>

        <Box
          bg="transparent"
          outline="none"
          _focus={{ boxShadow: 'none' }}
          cursor="not-allowed"
          padding="8px 12px"
          maxHeight={'40px'}
          width="100%"
          boxShadow="inset 0 0 0 1px #E4E6E7" // Updated border color
          borderRadius="md"
          className="text-balance overflow-scroll"
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <Text
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
            whiteSpace={'nowrap'}
          >
            {presentableLink}
          </Text>
        </Box>

        {shareList ? (
          <Box my={'10px'} w="full">
            <SearchableList
              onItemCheck={(id) => {
                if (checkedIds.includes(id)) {
                  setCheckedIds(checkedIds.filter((item) => item !== id));
                } else {
                  setCheckedIds([...checkedIds, id]);
                }
              }}
              onAllCheck={(checked) => {
                if (checked) {
                  setCheckedIds(shareList.map((item) => item.id));
                } else {
                  setCheckedIds([]);
                }
              }}
              checkedIds={checkedIds}
              items={shareList}
            />
          </Box>
        ) : (
          ''
        )}

        {!shareList ? (
          <div className="flex gap-2 mt-2">
            <Button
              onClick={copyShareLink}
              bg="#f4f4f5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="4px"
              padding="12px 14px"
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
              padding="12px 18px"
              borderRadius="md"
              border="none"
              cursor="pointer"
              color="#000"
              _hover={{ bg: '#e4e4e5' }}
              _active={{ bg: '#d4d4d5' }}
            >
              <span> Share on </span>
              <RiTwitterXLine style={{ width: '16px', height: '16px' }} />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 mt-2 justify-end w-full align-baseline">
            <Button
              onClick={copyShareLink}
              bg="#f4f4f5"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="4px"
              padding="12px 14px"
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
              onClick={() => forwardToUsers(checkedIds)}
              isDisabled={checkedIds.length === 0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="4px"
              padding="12px 14px"
              borderRadius="md"
              border="none"
              cursor="pointer"
            >
              <DocumentDuplicateIcon width={16} height={16} />
              <span> Share with students</span>
            </Button>
          </div>
        )}
      </ModalBody>
    </ModalContent>
  );
};

export default ShareModal;
