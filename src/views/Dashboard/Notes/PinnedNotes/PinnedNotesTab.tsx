/* eslint-disable react-hooks/exhaustive-deps */
import TableTag from '../../../../components/CustomComponents/CustomTag';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import { TrashIcon } from '../../../../components/icons';
import { TableTitleWrapper } from '../../../../components/notesTab/styles';
import SelectableTable, { TableColumn } from '../../../../components/table';
import { NoteModal } from '../Modal';
import { NoteEnums, PinnedNoteDetails } from '../types';
import { Menu, MenuList, MenuButton, Button, Text } from '@chakra-ui/react';
import { AlertStatus, ToastPosition } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import moment from 'moment';
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: Array<PinnedNoteDetails>;
}

const PinnedNotesTab: FC<Props> = ({ data }) => {
  const DELETE_NOTE_TITLE = 'Delete Note';

  const toast = useCustomToast();
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [noteId, setNoteId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceItem[]>([]);

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
  };

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < data.length;
    setChecked(selectedPeople.length === data.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : data);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const onDeleteNote = (isOpenDeleteModal: boolean, noteId: any) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setNoteId(noteId);
  };

  const gotoEditNote = (noteId: string | number) => {
    const noteURL = `/dashboard/notes/new-note/${noteId}`;
    if (noteId && noteId !== '') {
      navigate(noteURL);
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

  const DeleteNote = async () => {
    const noteIdInUse = noteId;

    if (!noteIdInUse || noteIdInUse === '') {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    setIsLoading(true);
    try {
      // Remove the deleted note from the dataSource
      setDataSource((prevDataSource) => {
        return prevDataSource.filter((item: any) => {
          if (item.id === noteIdInUse) {
            try {
              const storageId = NoteEnums.PINNED_NOTE_STORE_ID;
              localStorage.removeItem(storageId);
              showToast(DELETE_NOTE_TITLE, 'Pinned note deleted', 'success');
            } catch (error: any) {
              showToast(DELETE_NOTE_TITLE, error.message, 'error');
              setIsLoading(false);
              setDeleteNoteModal(false);
            }
          }
          // filter and return all items except deleted items
          return item.id !== noteIdInUse;
        });
      });
      setIsLoading(false);
      setDeleteNoteModal(false);
    } catch (error: any) {
      showToast(DELETE_NOTE_TITLE, error.message, 'error');
    }
  };

  // Define the type for the pinned note
  type PinnedNote = {
    noteId: string | null;
    pinnedNoteJSON: any;
  };

  // Function to get pinned notes from local storage
  const getPinnedNotesFromLocalStorage = (): PinnedNote[] | null => {
    const storageId = 'pinned_notes';
    const pinnedNotesString = localStorage.getItem(storageId);
    if (pinnedNotesString) {
      return JSON.parse(pinnedNotesString);
    }
    return null;
  };

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      setPinnedNotes((prevPinnedNotes) => [
        ...prevPinnedNotes,
        ...pinnedNotesFromLocalStorage
      ]);
    }
  }, []);

  type DataSourceItem = {
    key: number;
    title: string;
    dateCreated: string;
    lastModified: string;
    tags: string[];
    id: string | number;
  };

  const formatTags = (tags: string | string[]): any[] => {
    if (!tags) {
      return [];
    }
    if (typeof tags === 'string') {
      // If tags is a string, split it into an array and return
      return tags.split(',').map((tag) => {
        return <TableTag label={tag} />;
      });
    } else if (Array.isArray(tags)) {
      // If tags is an array, trim each tag and return it as it is
      return tags.map((tag) => {
        return <TableTag label={tag} />;
      });
    } else {
      // If tags is neither a string nor an array, return an empty array
      return [];
    }
  };

  const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
    const formattedDate = moment(date).format(format);
    return formattedDate;
  };

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      // Convert pinnedNotesFromLocalStorage to the desired format for dataSource
      const formattedData = pinnedNotesFromLocalStorage.map((note, i) => ({
        key: i,
        id: note.noteId || '',
        title: note.pinnedNoteJSON?.data?.topic || '',
        tags: formatTags(note.pinnedNoteJSON?.data?.tags),
        dateCreated: formatDate(
          new Date(note.pinnedNoteJSON?.data?.createdAt) || new Date()
        ),
        lastModified: formatDate(
          new Date(note.pinnedNoteJSON?.data?.updatedAt) || new Date()
        )
      }));

      setDataSource(formattedData);
    }
  }, []);

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'left',
      id: 0,
      render: ({ title, id }) => (
        <TableTitleWrapper>
          <Text onClick={() => gotoEditNote(id)} fontWeight="500">
            {title}
          </Text>
        </TableTitleWrapper>
      )
    },
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
      align: 'left',
      id: 1,
      render: ({ tags }) => <>{tags}</>
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
      render: ({ title, id }) => (
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
            <div
              onClick={() => {
                onDeleteNote(true, id);
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
      <div className="flow-root mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="z-10 inline-block h-screen min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 && (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600" onClick={toggleAll}>
                        Select all
                      </button>

                      <button
                        onClick={() => setDeleteAllNotesModal(true)}
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center px-6 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
              />
            </div>
          </div>
        </div>
      </div>

      <NoteModal
        title="Delete Pinned Notes"
        description="Are you sure you want to delete pinned Notes?"
        isLoading={isLoading}
        isOpen={deleteNoteModal}
        actionButtonText="Delete"
        onCancel={() => onCancel()}
        onDelete={() => DeleteNote()}
        onClose={() => setDeleteNoteModal(false)}
      />
    </>
  );
};

export default PinnedNotesTab;
