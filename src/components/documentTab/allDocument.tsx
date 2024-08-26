import { saveAsPDF, saveMarkdownAsPDF } from '../../library/fs';
import FlashModal from '../../views/Dashboard/FlashCards/components/FlashModal';
import { NoteModal } from '../../views/Dashboard/Notes/Modal';
import TableTag from '../CustomComponents/CustomTag';
import { useCustomToast } from '../CustomComponents/CustomToast/useCustomToast';
import TagModal from '../TagModal';
import {
  DownloadIcon,
  FlashCardsIcon,
  FlashCardsSolidIcon,
  TrashIcon
} from '../icons';
import {
  StyledMenuButton,
  StyledMenuSection,
  TableTitleWrapper,
  TableTagWrapper
} from '../notesTab/styles';
import SelectableTable, { TableColumn } from '../table';
import { Button, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import { AlertStatus, ToastPosition } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router';

type DataSourceItem = {
  key: number;
  title: string;
  dateCreated: string;
  lastModified: string;
  id: string | number;
  documentURL?: string;
  unFormatedTags: any;
};

export interface Props {
  data: any;
  handleTagSelection: any;
}

const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

const AllDocumentTab: FC<Props> = ({ data, handleTagSelection }) => {
  const toast = useCustomToast();
  const navigate = useNavigate();

  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [selectedDocumentIdToDelete, setSelectedDocumentIdToDelete] =
    useState(null);
  const [selectedDocumentIdToDeleteArray, setSelectedDocumentIdToDeleteArray] =
    useState<string[]>([]);
  const [selectedDocumentIdToAddTagsArray, setSelectedNoteIdToAddTagsArray] =
    useState<string[]>([]);
  const [selectedDocumentIdToAddTags, setSelectedDocumentIdToAddTags] =
    useState(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const [openFlashCard, setOpenFlashCard] = useState<boolean>(false);

  const [deleteDocumentModal, setDeleteDocumentModal] = useState(false);
  const [deleteAllDocumentsModal, setDeleteAllDocumentsModal] = useState(false);

  const [tagAllDocumentModal, setTagAllDocumentModal] = useState(false);
  const [openTagsModal, setOpenTagsModal] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const showFlashCardDropdown = () => {
    setOpenFlashCard((prevState) => !prevState);
  };
  const onDeleteDocument = (isOpenDeleteModal: boolean, noteId: any) => {
    setDeleteDocumentModal(isOpenDeleteModal);
    setSelectedPeople([]);
    setDocumentId(noteId);
  };

  const onDeleteAllDocument = (isOpenDeleteModal: boolean, noteId: any) => {
    setDeleteAllDocumentsModal(isOpenDeleteModal);
    setSelectedPeople([]);
    setDocumentId(noteId);
  };

  const onCancel = () => {
    setDeleteDocumentModal(!deleteDocumentModal);
    setSelectedRowKeys([]);
    setSelectedPeople([]);
  };

  const onAddTagToMultipleNotes = (
    isOpenTagAllDocumentModal: boolean,
    noteId: any,
    tags: string[]
  ) => {
    setTagAllDocumentModal(isOpenTagAllDocumentModal);
    setDocumentId(noteId);
  };

  const onAddTag = (openTagsModal: boolean, noteId: any, tags: string[]) => {
    setOpenTagsModal(openTagsModal);
    setDocumentId(noteId);
    setTags(tags);
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const sortTags = (tagElement) => {
    handleTagSelection(tagElement);
  };

  const formatTags = (tags: string | string[]): any[] => {
    if (!tags) {
      return [];
    }
    if (typeof tags === 'string') {
      // If tags is a string, split it into an array and return
      return tags.split(',').map((tag) => {
        return <TableTag label={tag} onClick={() => sortTags(tag)} />;
      });
    } else if (Array.isArray(tags)) {
      return tags.map((tag) => {
        return <TableTag label={tag} onClick={() => sortTags(tag)} />;
      });
    } else {
      return [];
    }
  };

  const [dataSource] = useState<DataSourceItem[]>(
    Array.from({ length: data.length }, (_, i) => ({
      key: i,
      id: data[i]?.id,
      title: data[i]?.title,
      unFormatedTags: data[i]?.tags,
      tags: formatTags(data[i]?.tags),
      dateCreated: formatDate(data[i]?.createdAt),
      lastModified: formatDate(data[i]?.updatedAt),
      documentURL: data[i]?.documentURL
    }))
  );

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < data.length;
    setChecked(selectedPeople.length === data.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  const handleSelectAll = () => {
    if (!allChecked) {
      const newSelectedRowKeys = dataSource.map(
        (data) => data.key as unknown as string
      );

      setSelectedRowKeys(newSelectedRowKeys);

      const newSelectedDocumentIds = dataSource.map((data) => data.id);
      const newSelectedDocumentIdsAsString = newSelectedDocumentIds.map((id) =>
        id.toString()
      );
      // Append the new selected note IDs to the existing array
      setSelectedDocumentIdToDeleteArray((prevArray) => [
        ...prevArray,
        ...newSelectedDocumentIdsAsString
      ]);

      setSelectedNoteIdToAddTagsArray((prevArray) => [
        ...prevArray,
        ...newSelectedDocumentIdsAsString
      ]);
    } else {
      setSelectedRowKeys([]);
      setSelectedPeople([]);
      setSelectedDocumentIdToDelete(null);
      setSelectedDocumentIdToAddTags(null);
    }
    setAllChecked(!allChecked);
  };

  function Done() {
    setSelectedRowKeys([]);
    setSelectedPeople([]);
    setAllChecked(false);

    setSelectedDocumentIdToDelete(null);
  }

  const gotoEditPdf = async (
    noteId: string | number,
    documentUrl,
    docTitle
  ) => {
    try {
      navigate(`/dashboard/notes/new-note`, {
        state: {
          documentUrl,
          docTitle
        }
      });
    } catch (error) {
      // console.log({ error });
    }
  };

  const showToast = (
    title: string,
    description: string,
    status: AlertStatus,
    position: ToastPosition = 'top-right',
    duration = 5000,
    isClosable = true
  ) => {
    toast({
      title: description,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
  };

  const downloadDocument = async (documentId: string | number, title: any) => {
    if (!documentId) {
      return showToast(
        'Download Alert',
        'Cannot download document. Please select a document',
        'error'
      );
    }
    const documentName = `${title}`;
    saveAsPDF(documentName, '');
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'left',
      id: 0,
      render: ({ title, id, documentURL }) => (
        <TableTitleWrapper>
          <Text
            onClick={() => gotoEditPdf(id, documentURL, title)}
            fontWeight="500"
          >
            {title}
          </Text>
        </TableTitleWrapper>
      )
    },
    {
      key: 'dateCreated',
      title: 'Date Created',
      dataIndex: 'dateCreated',
      align: 'left',
      id: 2
    },
    {
      key: 'lastModified',
      title: 'Last Modified',
      dataIndex: 'lastModified',
      align: 'left',
      id: 3
    },
    {
      key: 'actions',
      title: '',
      render: ({ id, title, unFormatedTags }) => (
        <Menu>
          <MenuButton
            as={Button}
            variant="unstyled"
            borderRadius="full"
            p={0}
            minW="auto"
            height="auto"
          >
            <FaEllipsisH fontSize={'12px'} />
          </MenuButton>
          <MenuList
            fontSize="14px"
            minWidth={'185px'}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            <section className="space-y-2 border-b pb-2">
              <button
                onClick={showFlashCardDropdown}
                className="w-full bg-gray-100 rounded-md flex items-center justify-between p-2"
              >
                <div className=" flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <FlashCardsIcon
                      className="w-4 h-4 text-primaryGray"
                      onClick={undefined}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Flashcards
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => {
                  onAddTag(true, id, unFormatedTags);
                }}
                className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
              >
                <div className="flex items-center space-x-1">
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <FlashCardsSolidIcon
                      onClick={undefined}
                      className="w-4 h-4 text-primaryGray"
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Edit tag
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
              <button className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2">
                <div
                  className="flex items-center space-x-1"
                  onClick={() => {
                    downloadDocument(id, title);
                  }}
                >
                  <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                    <DownloadIcon
                      className="w-4 h-4 text-primaryGray"
                      onClick={undefined}
                    />
                  </div>
                  <Text className="text-sm text-secondaryGray font-medium">
                    Download
                  </Text>
                </div>
                <ChevronRightIcon className="w-2.5 h-2.5" />
              </button>
            </section>
            <div
              onClick={() => {
                onDeleteDocument(true, id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '15px'
              }}
            >
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
              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </div>
          </MenuList>
        </Menu>
      )
    }
  ];

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-8 z-10">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 || allChecked ? (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button
                        className="text-gray-600"
                        onClick={handleSelectAll}
                      >
                        {allChecked ? 'Deselect all' : 'Select all'}
                      </button>

                      <Menu>
                        {selectedPeople.length > 1 || allChecked ? (
                          <StyledMenuButton
                            as={Button}
                            variant="unstyled"
                            borderRadius="full"
                            p={0}
                            minW="auto"
                            height="auto"
                            background="#F4F5F5"
                            display="flex"
                            className="flex items-center gap-2"
                            onClick={() => {
                              if (selectedDocumentIdToAddTagsArray) {
                                onAddTagToMultipleNotes(
                                  true,
                                  selectedDocumentIdToAddTagsArray,
                                  newTags
                                );
                              }
                            }}
                          >
                            <FlashCardsSolidIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            Add tags to all Doc
                          </StyledMenuButton>
                        ) : (
                          <StyledMenuButton
                            as={Button}
                            variant="unstyled"
                            borderRadius="full"
                            p={0}
                            minW="auto"
                            height="auto"
                            background="#F4F5F5"
                            display="flex"
                            className="flex items-center gap-2"
                            onClick={() => {
                              if (setSelectedDocumentIdToAddTags) {
                                onAddTag(
                                  true,
                                  selectedDocumentIdToAddTags,
                                  newTags
                                );
                                setSelectedDocumentIdToAddTags(null);
                              }
                            }}
                          >
                            <FlashCardsSolidIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            Add tag
                          </StyledMenuButton>
                        )}
                      </Menu>

                      {tagAllDocumentModal && (
                        <TagModal
                          onSubmit={() => {
                            // console.log("first")
                          }}
                          isOpen={tagAllDocumentModal}
                          onClose={() => setTagAllDocumentModal(false)}
                          tags={tags}
                          inputValue={inputValue}
                          handleAddTag={handleAddTag}
                          newTags={newTags}
                          setNewTags={setNewTags}
                          setInputValue={setInputValue}
                        />
                      )}
                    </div>

                    {selectedPeople.length > 1 || allChecked ? (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() => {
                          if (selectedDocumentIdToDeleteArray) {
                            onDeleteAllDocument(
                              true,
                              selectedDocumentIdToDeleteArray
                            );
                            setSelectedDocumentIdToDeleteArray([]);
                          }
                        }}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete All</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={() => {
                          if (selectedDocumentIdToDelete) {
                            onDeleteDocument(true, selectedDocumentIdToDelete);
                            setSelectedDocumentIdToDelete(null);
                          }
                        }}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-white px-6 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onChange={Done}
                    >
                      Done
                    </button>
                  </div>
                ) : null}
              </div>
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                handleSelectAll={handleSelectAll}
                allChecked={allChecked}
                setAllChecked={setAllChecked}
                setSelectedNoteIdToDelete={setSelectedDocumentIdToDelete}
                selectedNoteIdToDelete={selectedDocumentIdToDelete}
                setSelectedNoteIdToDeleteArray={
                  setSelectedDocumentIdToDeleteArray
                }
                selectedNoteIdToDeleteArray={selectedDocumentIdToDeleteArray}
                selectedNoteIdToAddTagsArray={selectedDocumentIdToAddTagsArray}
                setSelectedNoteIdToAddTagsArray={
                  setSelectedNoteIdToAddTagsArray
                }
                selectedNoteIdToAddTags={selectedDocumentIdToAddTags}
                setSelectedNoteIdToAddTags={setSelectedDocumentIdToAddTags}
              />

              <NoteModal
                title="Delete Document"
                description="Are you sure you want to delete Document?"
                isLoading={isLoading}
                isOpen={deleteDocumentModal}
                onCancel={() => onCancel()}
                onClose={() => setDeleteDocumentModal(false)}
                onDelete={function (): void {
                  // throw new Error('Function not implemented.');
                }}
              />

              <NoteModal
                title="Delete All Documents"
                description="Are you sure you want to delete all the marked Documents?"
                isLoading={isLoading}
                isOpen={deleteAllDocumentsModal}
                onCancel={() => {
                  setDeleteAllDocumentsModal(!deleteAllDocumentsModal);
                  setSelectedRowKeys([]);
                  setSelectedPeople([]);
                }}
                onDelete={function (): void {
                  // throw new Error('Function not implemented.');
                }}
                onClose={() =>
                  setDeleteAllDocumentsModal(!deleteAllDocumentsModal)
                }
              />

              {openTagsModal && (
                <TagModal
                  isOpen={openTagsModal}
                  onClose={() => setOpenTagsModal(false)}
                  tags={tags}
                  inputValue={inputValue}
                  handleAddTag={handleAddTag}
                  newTags={newTags}
                  setNewTags={setNewTags}
                  setInputValue={setInputValue}
                  onSubmit={() => {
                    // throw new Error('Function not implemented.');
                  }}
                />
              )}

              {openFlashCard && (
                <FlashModal
                  isOpen={openFlashCard}
                  onClose={() => setOpenFlashCard(false)}
                  title="Flash Card Title"
                  loadingButtonText="Creating..."
                  buttonText="Create"
                  onSubmit={(noteId) => {
                    // submission here
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllDocumentTab;
