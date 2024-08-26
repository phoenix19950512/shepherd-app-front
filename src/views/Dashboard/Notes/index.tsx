import CustomSideModal from '../../../components/CustomComponents/CustomSideModal';
import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import DropDownFilter from '../../../components/CustomComponents/DropDownFilter';
import DocumentCard from '../../../components/DocumentCard';
import TagModal from '../../../components/TagModal';
import UploadModal from '../../../components/UploadModal';
import { DeleteModal } from '../../../components/deleteModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import CustomTabPanel from '../../../components/tabPanel';
import { encodeQueryParams } from '../../../helpers';
import uploadFile from '../../../helpers/file.helpers';
import FileProcessingService from '../../../helpers/files.helpers/fileProcessing';
import { UploadMetadata } from '../../../helpers/s3Handler';
import { useSearch } from '../../../hooks';
import documentStore from '../../../state/documentStore';
import flashcardStore from '../../../state/flashcardStore';
import noteStore from '../../../state/noteStore';
import userStore from '../../../state/userStore';
import { NoteDetails, StudentDocument } from '../../../types';
import { useFlashcardWizard } from '../FlashCards/context/flashcard';
import SetupFlashcardPage from '../FlashCards/forms/flashcard_setup';
import Pagination from '../components/Pagination';
import ActionDropdown from './components/actionButton';
import { StyledImage } from './styles';
import {
  SimpleGrid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tab,
  Text,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
  MenuList,
  MenuButton,
  Tag,
  TagLabel,
  Box,
  Image,
  Stack,
  Menu,
  Center
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaCalendarAlt } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate, useLocation } from 'react-router-dom';
import { MAX_FILE_NAME_LENGTH } from '../../../helpers/constants';
import NoteSample from './components/noteSample';

const templates = [
  {
    id: 1,
    icon: 'plus',
    title: 'Blank document'
  },
  {
    id: 2,
    icon: 'plus',
    title: 'Resume'
  },
  {
    id: 3,
    icon: 'plus',
    title: 'Resume'
  },
  {
    id: 4,
    icon: 'plus',
    title: 'Letter'
  },
  {
    id: 5,
    icon: 'plus',
    title: 'Project proposal'
  },
  {
    id: 6,
    icon: 'plus',
    title: 'Brochure'
  }
];

const YourFlashCardIcon = () => (
  <StyledImage marginRight="10px">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="10"
      height="14"
    >
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  </StyledImage>
);

// YourEditTagsIcon.jsx
const YourEditTagsIcon = () => (
  <StyledImage marginRight="10px">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        fill="#6E7682"
        d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
      />
    </svg>
  </StyledImage>
);

const YourOpenDocchatIcon = () => (
  <StyledImage marginRight="10px">
    <IoChatboxEllipsesOutline />
  </StyledImage>
);

// YourDeleteIcon.jsx
const YourDeleteIcon = () => (
  <StyledImage marginRight="10px">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
        fill="#F53535"
      />
    </svg>
  </StyledImage>
);

interface Option {
  label: string;
  value: string;
}

const NotesDirectory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const toast = useCustomToast();
  const [hasSearched, setHasSearched] = useState(false);

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string | number>>([]);
  const [activeTab, setActiveTab] = useState<'notes' | 'files'>('notes');
  const { fetchFlashcards } = flashcardStore();
  const {
    setFlashcardData,
    flashcardData,
    resetFlashcard,
    isMinimized,
    isLoading: flashcardWizardLoading,
    setMinimized
  } = useFlashcardWizard();
  const [multiSelected, setMultiSelected] = useState<any>([]);
  const [confirmReady, setConfirmReady] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { user } = userStore();

  useEffect(() => {
    if (flashcardData?.documentId || flashcardData?.noteDoc) {
      setMinimized(false);
    }
    return () => {
      setMinimized(flashcardWizardLoading);
    };
  }, [flashcardWizardLoading]);

  const {
    fetchNotes,
    pagination: notesPagination,
    storeNoteTags,
    isLoading: notesIsLoading,
    deleteNote,
    notes,
    tags: noteTags
  } = noteStore();

  const {
    fetchStudentDocuments,
    pagination: docsPagination,
    storeDocumentTags,
    isLoading: docsIsLoading,
    deleteStudentDocument,
    studentDocuments,
    tags: docTags,
    saveDocument
  } = documentStore();

  const [selectedContent, setSelectedContent] = useState<Array<string>>([]);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });

  const handleSelectChange = (id: string, checked: boolean) => {
    setSelectedContent((prevselectedContent) => {
      if (checked) {
        return [...prevselectedContent, id];
      } else {
        return prevselectedContent.filter((existingId) => existingId !== id);
      }
    });
  };

  const handleSelectionChange = (selectedOptions: Option[]) => {
    setMultiSelected(selectedOptions);

    const selectedTags = selectedOptions
      .map((option) => option.value)
      .join(',');

    const query: { [key: string]: any } = {};
    if (selectedTags) {
      query.tags = selectedTags;
    }

    fetchItems(query);
  };

  const fetchItems = activeTab === 'notes' ? fetchNotes : fetchStudentDocuments;
  const pagination = activeTab === 'notes' ? notesPagination : docsPagination;

  const isLoading =
    activeTab === 'notes' ? notesIsLoading : docsIsLoading || loading;
  const [openSideModal, setOpenSideModal] = useState(false);
  const storeTags = activeTab === 'notes' ? storeNoteTags : storeDocumentTags;
  const items = activeTab === 'notes' ? notes : studentDocuments;
  const itemsCount = items.length;
  const itemName = activeTab === 'notes' ? 'Notes' : 'Files';
  const tags = activeTab === 'notes' ? noteTags : docTags;

  const actionFunc = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchItems({ search: query });
    },
    [fetchItems, hasSearched]
  );

  const handleSearch = useSearch(actionFunc);

  const filterOptions: Option[] = tags.map((tag) => ({
    label: tag,
    value: tag
  }));

  const isAllSelected = useMemo(() => {
    if (activeTab === 'notes') {
      return notes.every((note) => selectedContent.includes(note._id));
    } else {
      return studentDocuments.every((document) =>
        selectedContent.includes(document._id)
      );
    }
  }, [notes, selectedContent, studentDocuments, activeTab]);

  const gotoEditNote = (note: NoteDetails) => {
    const noteURL = `/dashboard/notes/new-note/${note._id}`;
    navigate(noteURL);
  };

  const gotoEditPdf = async (document: StudentDocument) => {
    const { title, documentUrl } = document;
    try {
      navigate(`/dashboard/notes/new-note`, {
        state: {
          documentUrl,
          docTitle: title
        }
      });
    } catch (error) {
      // console.log({ error });
    }
  };

  const [deleteItem, setDeleteItem] = useState<{
    note?: NoteDetails;
    document?: StudentDocument; // New field for Document details
    ids?: string[];
    currentDeleteType: 'single' | 'multiple';
  } | null>(null);

  const [tagEditItem, setTagEditItem] = useState<{
    note?: NoteDetails;
    document?: StudentDocument; // New field for Document details
    ids?: string[];
  } | null>(null);

  useEffect(() => {
    fetchStudentDocuments({ page: 1, limit: 20 }); // Replace with your actual fetchStudentDocuments function
    fetchNotes({ page: 1, limit: 20 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ingestDocument = async (document: StudentDocument) => {
    try {
      setLoading(true);
      if (document.ingestId) {
        const query = encodeQueryParams({
          documentUrl: document.documentUrl,
          docTitle: document.title,
          documentId: document.ingestId,
          sid: user._id
        });
        navigate(`/dashboard/docchat${query}`);
      } else {
        const fileProcessor = new FileProcessingService(
          { ...document, student: user?._id },
          true
        );
        const processData = await fileProcessor.process();

        const {
          data: [{ documentId }]
        } = processData;
        const query = encodeQueryParams({
          documentUrl: document.documentUrl,
          docTitle: document.title,
          documentId: documentId,
          sid: user._id
        });
        navigate(`/dashboard/docchat${query}`);
      }
    } catch (error) {
      toast({ title: 'Failed to load document', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const ingestNote = async (note?: NoteDetails) => {
    try {
      setLoading(true);
      const query = encodeQueryParams({
        noteId: note?._id,
        sid: user._id
      });
      navigate(`/dashboard/docchat${query}`);

      // if (document.ingestId) {
      //   navigate('/dashboard/docchat', {
      //     state: {
      //       documentUrl: document.documentUrl,
      //       docTitle: document.title,
      //       documentId: document.ingestId
      //     }
      //   });
      // } else {
      //   const fileProcessor = new FileProcessingService(
      //     { ...document, student: user?._id },
      //     true
      //   );
      //   const processData = await fileProcessor.process();

      //   const {
      //     data: [{ documentId }]
      //   } = processData;

      //   navigate('/dashboard/docchat', {
      //     state: {
      //       documentUrl: document.documentUrl,
      //       docTitle: document.title,
      //       documentId
      //     }
      //   });
      // }
    } catch (error) {
      toast({ title: 'Failed to load document', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const options = (note: NoteDetails) => [
    {
      label: 'Generate flashcard',
      onClick: () => {
        resetFlashcard();
        setFlashcardData((prev) => ({
          ...prev,
          deckname: '',
          studyType: '',
          studyPeriod: '',
          numQuestions: 0,
          timerDuration: '',
          hasSubmitted: false,
          noteDoc: note._id
        }));
        setOpenSideModal(true);
      },
      icon: <YourFlashCardIcon />
    },
    {
      label: 'Edit Tags',
      onClick: () => setTagEditItem({ note }),
      icon: <YourEditTagsIcon />
    },
    {
      label: 'Open in DocChat',
      onClick: () => {
        ingestNote(note);
      },
      icon: <YourOpenDocchatIcon />
    },
    {
      label: 'Delete',
      onClick: () => setDeleteItem({ note, currentDeleteType: 'single' }),
      color: '#F53535',
      icon: <YourDeleteIcon />
    }
  ];

  const documentOptions = (studentDocument: StudentDocument) => [
    {
      label: 'Flashcard',
      onClick: () => {
        resetFlashcard();
        setFlashcardData((prev) => ({
          ...prev,
          deckname: '',
          studyType: '',
          studyPeriod: '',
          numQuestions: 0,
          timerDuration: '',
          hasSubmitted: false,
          ingestId: studentDocument.documentUrl,
          documentId: studentDocument.documentUrl
        }));
        setOpenSideModal(true);
      },
      icon: <YourFlashCardIcon />
    },
    {
      label: 'Edit Tags',
      onClick: () => setTagEditItem({ document: studentDocument }),
      icon: <YourEditTagsIcon />
    },
    {
      label: 'Open in DocChat',
      onClick: () => ingestDocument(studentDocument),
      icon: <YourOpenDocchatIcon />
    },
    {
      label: 'Delete',
      onClick: () =>
        setDeleteItem({
          document: studentDocument,
          currentDeleteType: 'single'
        }),
      color: '#F53535',
      icon: <YourDeleteIcon />
    }
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const activeTabFromQuery = queryParams.get('activeTab');

    if (activeTabFromQuery && activeTabFromQuery !== activeTab) {
      setActiveTab(activeTabFromQuery as 'notes' | 'files');
    }
  }, [location, activeTab]);

  const handleTabChange = (index: number) => {
    const tab = index === 0 ? 'notes' : 'files';
    setActiveTab(tab);
    const currentQuery = new URLSearchParams(location.search);
    currentQuery.set('activeTab', tab);
    navigate(`${location.pathname}?${currentQuery.toString()}`);
    if (selectedTags.length) {
      setSelectedTags([]);
    }
    setDeleteItem(null);
    setTagEditItem(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags([tag]);
    fetchNotes({ tags: tag });
  };

  const onTagSubmit = async (tags: string[]) => {
    const ids =
      tagEditItem?.ids ||
      ((activeTab === 'notes'
        ? tagEditItem?.note?._id
        : tagEditItem?.document?._id) as string);

    const isSaved = await storeTags(ids, tags); // Using storeTags based on activeTab

    if (isSaved) {
      toast({
        position: 'top-right',
        title: `Tags Added for ${
          tagEditItem?.note?.topic || tagEditItem?.document?.title || 'Item'
        }`,
        status: 'success'
      });
      setTagEditItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to add tags for ${
          tagEditItem?.note?.topic || tagEditItem?.document?.title || 'Item'
        }`,
        status: 'error'
      });
    }
  };

  const editableTags = useMemo(() => {
    if (activeTab === 'notes') return tagEditItem?.note?.tags || [];
    return tagEditItem?.document?.tags || [];
  }, [activeTab, tagEditItem]);

  const handleTemplateClick = (templateId) => {
    console.log(1);
    navigate(`/dashboard/notes/new-note`);
  };

  const NotesTemplate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
      <>
        <Text
          fontFamily="Inter"
          fontWeight="600"
          fontSize={{ base: '18px', md: '30px' }}
          m="20px 0 20px 25px"
          lineHeight="30px"
          letterSpacing="-2%"
          color="#212224"
        >
          Start a new document
        </Text>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, xl: 6 }}
          justifyContent="space-around"
          mb="20px"
        >
          {templates.map((template) => (
            <NoteSample
              template={template}
              onSelectTemplate={handleTemplateClick}
            />
          ))}
        </SimpleGrid>
      </>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return;
    return (
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'start'}
        height={'40vh'}
      >
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
            mb="10px"
            fontSize="16px"
            fontStyle="normal"
            fontWeight="500"
            lineHeight="21px"
            letterSpacing="0.112px"
          >
            You don’t have a {activeTab ? 'note' : 'file'}
          </Text>
          <ActionDropdown
            activeTab={activeTab}
            onOptionClick={(option) => {
              if (option === 'upload-document') {
                setOpenUploadModal(true);
              } else {
                navigate('/dashboard/notes/notes-template');
              }
            }}
          />
        </Box>
      </Box>
    );
  };

  const onTagDelete = async () => {
    // Generate the ID or IDs to delete based on whether you are in 'notes' or 'documents' tab
    const id =
      deleteItem?.ids?.join(',') ||
      ((activeTab === 'notes'
        ? deleteItem?.note?._id
        : deleteItem?.document?._id) as string);

    // Assume you have a deleteItem function that works for documents, similar to deleteNote for notes
    const deleteFunc =
      activeTab === 'notes' ? deleteNote : deleteStudentDocument;

    const isDeleted = await deleteFunc(id);

    if (isDeleted) {
      toast({
        position: 'top-right',
        title: `${
          deleteItem?.note?.topic || deleteItem?.document?.title
        } deleted successfully`,
        status: 'success'
      });
      setDeleteItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to delete ${
          deleteItem?.note?.topic || deleteItem?.document?.title
        }`,
        status: 'error'
      });
    }
  };

  const onSelectionChange = (item: string | number | (string | number)[]) => {
    const tags = Array.isArray(item) ? item.join(',') : (item as string);

    const query: { [key: string]: any } = {};
    if (tags || tags.length) {
      query.tags = tags;
    }
    fetchItems(query);
  };

  return (
    <>
      {/* {isLoading && <LoaderOverlay />} */}
      {(tagEditItem?.note || tagEditItem?.document || tagEditItem?.ids) && (
        <TagModal
          tags={editableTags}
          onSubmit={onTagSubmit}
          onClose={() => setTagEditItem(null)}
          isOpen={Boolean(tagEditItem)}
        />
      )}

      <UploadModal
        isOpen={openUploadModal}
        onClose={() => {
          setOpenUploadModal(false);
          setFile(null);
        }}
        accept="application/pdf"
        isLoading={isUploadingFile}
        progress={progress}
        countdown={countdown}
        setProgress={setProgress}
        confirmReady={confirmReady}
        file={file}
        setFile={setFile}
        onUpload={(file) => {
          const uploadEmitter = uploadFile(file, {
            studentID: user?._id as string,
            documentID: file.name
          });

          let readableFileName = file.name
            .toLowerCase()
            .replace(/\.pdf$/, '')
            .replace(/_/g, ' ');

          if (readableFileName.length > MAX_FILE_NAME_LENGTH) {
            readableFileName = readableFileName.substring(
              0,
              MAX_FILE_NAME_LENGTH
            );
            setCountdown((prev) => ({
              active: true,
              message: `The file name has been truncated to ${MAX_FILE_NAME_LENGTH} characters`
            }));
            setProgress(5);
          }

          setCountdown(() => ({
            active: true,
            message: 'Uploading... your document is being uploaded'
          }));

          uploadEmitter.on('progress', (progress: number) => {
            if (!isUploadingFile) {
              setIsUploadingFile(true);

              setProgress(progress);
              setLoading(true);
            }
          });
          uploadEmitter.on('complete', async (responseData: UploadMetadata) => {
            const { fileUrl: documentUrl, documentID, name } = responseData;
            try {
              const title =
                documentID ||
                name ||
                decodeURIComponent(
                  (documentUrl.match(/\/([^/]+)(?=\.\w+\?)/) || [])[1] || ''
                ).replace('uploads/', '');

              const response = await saveDocument({ title, documentUrl });
              if (response) {
                setOpenUploadModal(false);
                toast({
                  title: 'Document saved',
                  status: 'success',
                  position: 'top-right'
                });
                setFile(null);
                setConfirmReady(true);
                setCountdown((prev) => ({
                  active: false,
                  message: 'Document uploaded'
                }));
              } else {
                toast({
                  title: 'Failed to save document',
                  status: 'error',
                  position: 'top-right'
                });
                setConfirmReady(false);
              }
              setIsUploadingFile(false);
            } catch (error) {
              toast({
                title: 'Failed to save document',
                status: 'error',
                position: 'top-right'
              });
            } finally {
              setIsUploadingFile(false);
            }
          });
          uploadEmitter.on('error', (error) => {
            toast({
              title: 'Failed to save document',
              status: 'error',
              position: 'top-right'
            });
            setIsUploadingFile(false);
          });
        }}
      />

      <CustomSideModal
        onClose={() => {
          setOpenSideModal(false);
          resetFlashcard();
        }}
        isOpen={openSideModal}
      >
        <div style={{ margin: '3rem 0', overflowY: 'auto' }}>
          <SetupFlashcardPage showConfirm isAutomated />
        </div>
      </CustomSideModal>

      <DeleteModal
        entity={activeTab === 'notes' ? 'note' : 'document'} // Set entity based on activeTab
        isLoading={isLoading}
        isOpen={Boolean(deleteItem)}
        onCancel={() => setDeleteItem(null)}
        onDelete={() => onTagDelete()}
        onClose={() => null}
      />

      <Box
        padding={{ md: '20px', base: '10px' }}
        overflowX={{ base: 'hidden' }}
      >
        <Flex
          width="100%"
          marginBottom={'40px'}
          alignItems="center"
          justifyContent="space-between"
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
              {itemName}
            </Text>
            <Tag ml="10px" borderRadius="5" background="#f7f8fa" size="md">
              <TagLabel fontWeight={'bold'}> {itemsCount}</TagLabel>
            </Tag>
          </Box>
          <ActionDropdown
            activeTab={activeTab}
            onOptionClick={(option) => {
              if (option === 'upload-document') {
                setOpenUploadModal(true);
              } else {
                navigate('/dashboard/notes/notes-template');
              }
            }}
          />
        </Flex>

        <Stack
          direction={{ base: 'column', md: 'row' }}
          width="100%"
          mb={{ base: '20px', md: '40px' }}
          alignItems="center"
          justifyContent="space-between"
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
          <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            width={{ base: '100%', md: 'auto' }}
          >
            <MultiSelect
              options={filterOptions}
              value={multiSelected}
              onChange={handleSelectionChange}
              labelledBy="Select"
              valueRenderer={() => (
                <span
                  style={{
                    fontWeight: '500',
                    color: 'rgb(110, 118, 130)',
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Filter By Tags
                </span>
              )}
            />
            {/* <DropDownFilter
              selectedItems={selectedTags}
              multi
              style={{ marginRight: '20px' }}
              filterLabel="Filter By Tags"
              onSelectionChange={onSelectionChange}
              items={tags.map((tag) => ({ id: tag, value: tag }))}
            /> */}
            <Menu>
              <MenuButton>
                <Flex
                  cursor="pointer"
                  border="1px solid #E5E6E6"
                  padding="5px 10px"
                  borderRadius="6px"
                  alignItems="center"
                  mb={{ base: '10px', md: '0' }}
                  width={{ base: '-webkit-fill-available', md: 'auto' }}
                >
                  <Text
                    fontWeight="400"
                    fontSize={{ base: '12px', md: '14px' }}
                    marginRight="5px"
                    color="#5E6164"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    Sort By
                  </Text>
                  <FaCalendarAlt color="#96999C" size="12px" />
                </Flex>
              </MenuButton>
              <MenuList
                fontSize="14px"
                minWidth={'185px'}
                borderRadius="8px"
                backgroundColor="#FFFFFF"
                boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
              >
                <MenuItem
                  color="#212224"
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => fetchFlashcards({ sort: 'createdAt' })}
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Created At
                </MenuItem>
                <MenuItem
                  color="#212224"
                  fontSize="14px"
                  onClick={() => fetchFlashcards({ sort: 'updatedAt' })}
                  _hover={{ bgColor: '#F2F4F7' }}
                  lineHeight="20px"
                  fontWeight="400"
                  p="6px 8px 6px 8px"
                >
                  Last Updated
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Stack>
        <Box overflowX={{ base: 'scroll', md: 'hidden' }}>
          {selectedContent.length ? (
            <Box>
              <Button
                variant="solid"
                mb="10px"
                borderRadius={'10px'}
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  const items =
                    activeTab === 'notes' ? notes : studentDocuments;

                  if (isAllSelected) setSelectedContent([]);
                  else {
                    setSelectedContent(items.map((item) => item._id));
                  }
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.83317 4.00033V1.50033C3.83317 1.04009 4.20627 0.666992 4.6665 0.666992H14.6665C15.1267 0.666992 15.4998 1.04009 15.4998 1.50033V13.167C15.4998 13.6272 15.1267 14.0003 14.6665 14.0003H12.1665V16.4996C12.1665 16.9602 11.7916 17.3337 11.3275 17.3337H1.33888C0.875492 17.3337 0.5 16.9632 0.5 16.4996L0.502167 4.83438C0.50225 4.37375 0.8772 4.00033 1.34118 4.00033H3.83317ZM5.49983 4.00033H12.1665V12.3337H13.8332V2.33366H5.49983V4.00033ZM3.83317 8.16699V9.83366H8.83317V8.16699H3.83317ZM3.83317 11.5003V13.167H8.83317V11.5003H3.83317Z"
                    fill="white"
                  />
                </svg>
                <Text ml="5px">
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </Text>
              </Button>

              <Button
                variant="solid"
                mb="10px"
                marginLeft={'10px'}
                borderRadius={'10px'}
                colorScheme={'#F53535'}
                _hover={{ bg: '#F53535' }}
                bg="#F53535"
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  const items =
                    activeTab === 'notes' ? notes : studentDocuments;

                  if (!items) return;

                  setDeleteItem((prev) => ({
                    ...prev,
                    currentDeleteType: 'multiple',
                    ids: selectedContent // Using a generic "ids" field instead of "notesIds"
                  }));
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.83317 4.00033V1.50033C3.83317 1.04009 4.20627 0.666992 4.6665 0.666992H14.6665C15.1267 0.666992 15.4998 1.04009 15.4998 1.50033V13.167C15.4998 13.6272 15.1267 14.0003 14.6665 14.0003H12.1665V16.4996C12.1665 16.9602 11.7916 17.3337 11.3275 17.3337H1.33888C0.875492 17.3337 0.5 16.9632 0.5 16.4996L0.502167 4.83438C0.50225 4.37375 0.8772 4.00033 1.34118 4.00033H3.83317ZM5.49983 4.00033H12.1665V12.3337H13.8332V2.33366H5.49983V4.00033ZM3.83317 8.16699V9.83366H8.83317V8.16699H3.83317ZM3.83317 11.5003V13.167H8.83317V11.5003H3.83317Z"
                    fill="white"
                  />
                </svg>
                <Text ml="5px">Delete Notes</Text>
              </Button>

              <Button
                variant="solid"
                mb="10px"
                borderRadius={'10px'}
                marginLeft={'10px'}
                colorScheme={'primary'}
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  if (!notes) return;
                  setTagEditItem((prev) => ({
                    ...prev,
                    ids: selectedContent
                  }));
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="white"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>

                <Text ml="5px">Add Tag</Text>
              </Button>
            </Box>
          ) : (
            ''
          )}
        </Box>
        <Tabs index={activeTab === 'notes' ? 0 : 1} onChange={handleTabChange}>
          <TabList mb="1em">
            <Tab>Notes</Tab>
            <Tab>Files</Tab>
            {/* Add other tabs as needed */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <NotesTemplate />
              {notes.length ? (
                <Box>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                    spacing={15}
                  >
                    {notes.map((note, index) => (
                      <DocumentCard
                        onTagClick={handleTagClick}
                        onClick={() => gotoEditNote(note)}
                        isSelected={selectedContent.includes(note._id)}
                        onSelect={(checked) =>
                          handleSelectChange(note._id, checked)
                        }
                        options={options(note)}
                        key={index}
                        data={{
                          topic: note.topic,
                          tags: note.tags,
                          updatedAt: note.updatedAt as unknown as string,
                          id: note._id
                        }}
                      />
                    ))}
                  </SimpleGrid>
                  <Center mt={4}>
                    {notes.length ? (
                      <Pagination
                        limit={pagination.limit}
                        page={pagination.page}
                        handlePagination={(nextPage) =>
                          fetchNotes({
                            page: nextPage,
                            limit: pagination.limit
                          })
                        }
                        count={pagination.count}
                      />
                    ) : (
                      ''
                    )}
                  </Center>
                </Box>
              ) : (
                renderEmptyState()
              )}
            </TabPanel>
            <TabPanel>
              {studentDocuments.length ? (
                <Box>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                    spacing={15}
                  >
                    {studentDocuments.map((studentDocument, index) => (
                      <DocumentCard
                        footerColor="#fcd99f"
                        onTagClick={handleTagClick}
                        onClick={() => gotoEditPdf(studentDocument)}
                        isSelected={selectedContent.includes(
                          studentDocument._id
                        )}
                        onSelect={(checked) =>
                          handleSelectChange(studentDocument._id, checked)
                        }
                        options={documentOptions(studentDocument)}
                        key={index}
                        data={{
                          topic: studentDocument.title,
                          tags: studentDocument.tags,
                          updatedAt:
                            studentDocument.updatedAt as unknown as string
                        }}
                      />
                    ))}
                  </SimpleGrid>
                  <Center mt={4}>
                    {studentDocuments.length ? (
                      <Pagination
                        limit={pagination.limit}
                        page={pagination.page}
                        handlePagination={(nextPage) =>
                          fetchStudentDocuments({
                            page: nextPage,
                            limit: pagination.limit
                          })
                        }
                        count={pagination.count}
                      />
                    ) : (
                      ''
                    )}
                  </Center>
                </Box>
              ) : (
                renderEmptyState()
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default NotesDirectory;
