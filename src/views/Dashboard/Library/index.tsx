import LoaderOverlay from '../../../components/loaderOverlay';
import { useSearch } from '../../../hooks';
import librarySubjectStore from '../../../state/librarySubjectStore';
import libraryProviderStore from '../../../state/libraryProviderStore';
import LibraryCardList from './components/LibraryCardList';
import ProviderList from './components/ProviderList';
import SubjectList from './components/SubjectList';
import TopicList from './components/TopicList';
import DeckList from './components/DeckList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tag,
  TagLabel,
  Text
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate, useLocation } from 'react-router-dom';

const Library: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasSearched, setHasSearched] = useState(false);
  const [displayMode, setDisplayMode] = useState('providers');
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(null);

  const [breadcrumbNav, setBreadcrumbNav] = useState<
    Array<{ label: string; mode: string }>
  >([{ label: 'Providers', mode: 'providers' }]);

  const navigationHistory = useRef<
    { label: string; mode: string; path: string }[]
  >([{ label: 'Providers', mode: 'providers', path: '/dashboard/library' }]);

  const updateNavigationHistory = (mode, label, path) => {
    const currentIndex = navigationHistory.current.findIndex(
      (item) => item.mode === mode
    );
    if (currentIndex > -1) {
      navigationHistory.current = navigationHistory.current.slice(
        0,
        currentIndex + 1
      );
    } else {
      navigationHistory.current.push({ label, mode, path });
    }
  };

  const updateBreadcrumbNav = () => {
    const newBreadcrumbNav = [{ label: 'Providers', mode: 'providers' }];
    switch (displayMode) {
      case 'subjects':
        newBreadcrumbNav.push({ label: 'Subjects', mode: 'subjects' });
        break;
      case 'topics':
        newBreadcrumbNav.push(
          { label: 'Subjects', mode: 'subjects' },
          { label: 'Topics', mode: 'topics' }
        );
        break;
      case 'decks':
        newBreadcrumbNav.push(
          { label: 'Subjects', mode: 'subjects' },
          { label: 'Topics', mode: 'topics' },
          { label: 'Decks', mode: 'decks' }
        );
        break;
      case 'cards':
        newBreadcrumbNav.push(
          { label: 'Subjects', mode: 'subjects' },
          { label: 'Topics', mode: 'topics' },
          { label: 'Decks', mode: 'decks' },
          { label: 'Cards', mode: 'cards' }
        );
        break;
      default:
        break;
    }
    setBreadcrumbNav(newBreadcrumbNav);
  };

  useEffect(() => {
    updateBreadcrumbNav();
  }, [
    displayMode,
    selectedProviderId,
    selectedSubjectId,
    selectedTopicId,
    selectedDeckId
  ]);

  useEffect(() => {
    const displayModes = {
      provider: {
        label: 'Providers',
        mode: 'providers',
        path: '/dashboard/library'
      },
      subjects: {
        label: 'Subjects',
        mode: 'subjects',
        path: `/dashboard/library/providers/${selectedProviderId}`
      },
      topics: {
        label: 'Topics',
        mode: 'topics',
        path: `/dashboard/library/subjects/${selectedSubjectId}`
      },
      decks: {
        label: 'Decks',
        mode: 'decks',
        path: `/dashboard/library/topics/${selectedTopicId}`
      },
      cards: {
        label: 'Cards',
        mode: 'cards',
        path: `/dashboard/library/decks/${selectedDeckId}`
      }
    };

    if (displayModes[displayMode]) {
      updateNavigationHistory(
        displayMode,
        displayModes[displayMode].label,
        displayModes[displayMode].path
      );
    }
  }, [
    selectedProviderId,
    selectedSubjectId,
    selectedTopicId,
    selectedDeckId,
    displayMode
  ]);

  const handleProviderClick = (providerId) => {
    setSelectedProviderId(providerId);
    setDisplayMode('subjects');
    navigate(`/dashboard/library/providers/${providerId}`);
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setDisplayMode('topics');
    navigate(`/dashboard/library/subjects/${subjectId}`);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopicId(topicId);
    setDisplayMode('decks');
    navigate(`/dashboard/library/topics/${topicId}`);
  };

  const handleDeckClick = (deckId) => {
    setSelectedDeckId(deckId);
    setDisplayMode('cards');
    navigate(`/dashboard/library/decks/${deckId}`);
  };

  const { fetchLibrarySubjects, isLoading, librarySubjects } =
    librarySubjectStore();

  const {
    fetchLibraryProviders,
    libraryProviders,
    isLoading: providersLoading
  } = libraryProviderStore();

  const actionFunc = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchLibrarySubjects(selectedProviderId, { search: query });
    },
    [fetchLibrarySubjects, hasSearched]
  );

  const handleSearch = useSearch(actionFunc);

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 3) {
      const [, , type, id] = pathSegments;
      switch (type) {
        case 'providers':
          setDisplayMode('subjects');
          setSelectedProviderId(id);
          break;
        case 'subjects':
          setDisplayMode('topics');
          setSelectedSubjectId(id);
          break;
        case 'topics':
          setDisplayMode('decks');
          setSelectedTopicId(id);
          break;
        case 'decks':
          setDisplayMode('cards');
          setSelectedDeckId(id);
          break;
        default:
          setDisplayMode('providers');
          setSelectedProviderId(null);
          setSelectedSubjectId(null);
          setSelectedTopicId(null);
          setSelectedDeckId(null);
          break;
      }
    } else {
      setDisplayMode('providers');
      setSelectedProviderId(null);
      setSelectedSubjectId(null);
      setSelectedTopicId(null);
      setSelectedDeckId(null);
    }
  }, [location]);

  useEffect(() => {
    fetchLibraryProviders();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* {providersLoading && !libraryProviders?.length && <LoaderOverlay />}
      {displayMode === 'subjects' && isLoading && !librarySubjects?.length && (
        <LoaderOverlay />
      )} */}

      {!libraryProviders?.length && !hasSearched && !isLoading ? (
        <Box
          background={'#F8F9FB'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          height={'calc(100vh - 80px)'}
        >
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            color="#E5E6E6"
            pt={{ base: '10px', md: '20px' }}
            pl={{ base: '10px', md: '20px' }}
          >
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize={{ base: '18px', md: '24px' }}
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Library
            </Text>
          </Flex>
          <Box
            width={'100%'}
            display={'flex'}
            height="100%"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <img
              src="/images/empty_illustration.svg"
              alt="empty directory icon"
            />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              No cards to display
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          padding={{ md: '20px', base: '10px' }}
          overflowX={{ base: 'hidden' }}
        >
          <Flex
            width="100%"
            marginBottom={'20px'}
            alignItems="center"
            justifyContent="space-between"
            paddingRight={{ md: '20px' }}
            color="#E5E6E6"
          >
            <Box display="flex">
              <Text
                fontFamily="Inter"
                fontWeight="600"
                fontSize="24px"
                lineHeight="30px"
                letterSpacing="-2%"
                color="#212224"
              >
                Library
              </Text>
              {/* <Tag ml="10px" borderRadius="5" background="#f7f8fa" size="md">
                <TagLabel fontWeight={'bold'}>
                  {' '}
                  {librarySubjects?.length || 0}
                </TagLabel>
              </Tag> */}
            </Box>
          </Flex>

          {displayMode === 'subjects' ? (
            <Stack
              direction={{ base: 'column', md: 'row' }}
              width="100%"
              mb={{ base: '20px' /* md: '40px' */ }}
              alignItems="center"
              justifyContent="space-between"
              pr={{ md: '20px', base: '0' }}
              color="#E5E6E6"
              spacing={4}
            >
              <Flex alignItems="center">
                <InputGroup
                  size="sm"
                  borderRadius="6px"
                  width={{ base: '100%', md: '200px' }}
                  height="32px"
                >
                  <InputLeftElement marginRight={'10px'} pointerEvents="none">
                    <BsSearch color="#5E6164" size="14px" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    variant="outline"
                    onChange={(e) => handleSearch(e.target.value)}
                    size="sm"
                    placeholder="Search"
                    borderRadius="6px"
                  />
                </InputGroup>
              </Flex>
            </Stack>
          ) : (
            <Box width={{ base: '100%', md: '200px' }} height="52px" />
          )}

          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="gray.500" />}
            marginBottom="20px"
          >
            {breadcrumbNav.map((item, index) => (
              <BreadcrumbItem
                key={index}
                isCurrentPage={index === breadcrumbNav.length - 1}
              >
                <BreadcrumbLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const historyItem = navigationHistory.current.find(
                      (h) => h.mode === item.mode
                    );
                    if (historyItem) {
                      setDisplayMode(historyItem.mode);
                      navigate(historyItem.path);
                    }
                  }}
                >
                  <Text fontSize="18px" fontFamily="Inter">
                    {item.label}
                  </Text>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
          <Box>
            {displayMode === 'providers' && (
              <ProviderList
                providers={libraryProviders}
                onSelectProvider={handleProviderClick}
              />
            )}
            {displayMode === 'subjects' && (
              <SubjectList
                subjectId={selectedProviderId}
                onSelectSubject={handleSubjectClick}
              />
            )}
            {displayMode === 'topics' && (
              <TopicList
                subjectId={selectedSubjectId}
                onSelectTopic={handleTopicClick}
              />
            )}
            {displayMode === 'decks' && (
              <DeckList
                topicId={selectedTopicId}
                onSelectDeck={handleDeckClick}
              />
            )}
            {displayMode === 'cards' && (
              <LibraryCardList deckId={selectedDeckId} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Library;
