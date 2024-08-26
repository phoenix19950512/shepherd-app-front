import clsx from 'clsx';
import AddTag from '../../../../assets/addTag.svg?react';
import BackArrow from '../../../../assets/backArrowFill.svg?react';
import DownloadIcon from '../../../../assets/download.svg?react';
import FlashCardIcn from '../../../../assets/flashCardIcn.svg?react';
import SideBarPinIcn from '../../../../assets/sideBarPin.svg?react';
import ArrowRight from '../../../../assets/small-arrow-right.svg?react';
import ZoomIcon from '../../../../assets/square.svg?react';
import TrashIcon from '../../../../assets/trash-icn.svg?react';
import CustomButton from '../../../../components/CustomComponents/CustomButton';
import CustomSideModal from '../../../../components/CustomComponents/CustomSideModal';
import TableTag from '../../../../components/CustomComponents/CustomTag';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../../components/TagModal';
// import useDebounce from '../../../../hooks/useDebounce';
import { saveHTMLAsPDF } from '../../../../library/fs';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import TempPDFViewer from '../../DocChat/TempPDFViewer';
import FlashModal from '../../FlashCards/components/FlashModal';
import { useFlashcardWizard } from '../../FlashCards/context/flashcard';
import SetupFlashcardPage from '../../FlashCards/forms/flashcard_setup';
import { NoteModal } from '../Modal';
import { StyledImage } from '../styles';
import {
  NoteData,
  NoteDetails,
  NoteEnums,
  NoteServerResponse,
  NoteStatus
} from '../types';
import {
  DropDownFirstPart,
  DropDownLists,
  FirstSection,
  Header,
  HeaderButton,
  HeaderWrapper,
  HeaderButtonText,
  NewNoteWrapper,
  NoteBody,
  HeaderTagsWrapper,
  FullScreenNoteWrapper,
  SecondSection,
  StyledEditor,
  StyledNoteWrapper,
  StyledNoteContainer,
  StyledNoteContent
} from './styles';
import '@blocknote/core/style.css';
import {
  Menu,
  MenuList,
  MenuButton,
  Button,
  AlertStatus,
  ToastPosition,
  IconButton,
  MenuItem,
  Text,
  Box,
  useToast,
  Icon
} from '@chakra-ui/react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  CLEAR_EDITOR_COMMAND,
  LexicalEditor as EditorType
} from 'lexical';
import {
  defaultTo,
  filter,
  isEmpty,
  isNil,
  isString,
  truncate,
  union
} from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BsFillPinFill } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDebounce } from 'usehooks-ts';
import useTimer from '../../../../hooks/useTimer';
import { useSearchQuery } from '../../../../hooks';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { newId } from '../../../../helpers/id';
import { copyTextToClipboard } from '../../../../helpers/copyTextToClipboard';
import { firebaseAuth } from '../../../../firebase';
import PlansModal from '../../../../components/PlansModal';
import ShareModal from '../../../../components/ShareModal';
import { RiRemoteControlLine } from '@remixicon/react';
import { encodeQueryParams } from '../../../../helpers';
// import CustomToast from '../../../../components/CustomComponents/CustomToast';
// import { MdSavings } from 'react-icons/md';
// import { callback } from 'chart.js/dist/helpers/helpers.core';

const DEFAULT_NOTE_TITLE = 'Enter Note Title';
const DELETE_NOTE_TITLE = 'Delete Note';
const UPDATE_NOTE_TITLE = 'Note Alert';

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
    return tags.map((tag) => {
      return <TableTag label={tag} />;
    });
  } else {
    return [];
  }
};

// Define the type for the pinned note
type PinnedNote = {
  noteId: string | null;
  pinnedNoteJSON: any;
};

const createNote = async (
  data: NoteData
): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.createNote(data);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

const deleteNote = async (id: string): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.deleteNote(id);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

const updateNote = async (
  id: string,
  data: NoteData
): Promise<NoteServerResponse | null> => {
  const resp = await ApiService.updateNote(id, data);
  const respText = await resp.text();
  try {
    const respDetails: NoteServerResponse = JSON.parse(respText);
    return respDetails;
  } catch (error: any) {
    return { error: error.message, message: error.message };
  }
};

const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

const getLocalStorageNoteId = (noteId: string | null): string => {
  const genId = noteId ? noteId : '';
  return genId;
};

const saveNoteLocal = (noteId: string, noteContent: string) => {
  const storeId = getLocalStorageNoteId(noteId);
  return localStorage.setItem(storeId, noteContent);
};

const deleteNoteLocal = (noteId: string) => {
  const storeId = getLocalStorageNoteId(noteId);
  return localStorage.removeItem(storeId);
};

const getNoteLocal = (noteId: string | null): string | null => {
  const storageId = getLocalStorageNoteId(noteId);
  const content = localStorage.getItem(storageId);
  return content;
};

const handleOptionClick = (
  onClick: ((...args: any[]) => void) | undefined,
  ...params: any
) => {
  if (typeof onClick === 'function') {
    onClick.call(null, ...(params || []));
  }
};

const NewNote = () => {
  // const toastIdRef = useRef<any>();
  // const chakraToast = useToast();
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const defaultNoteTitle = DEFAULT_NOTE_TITLE;

  const [saveDetails, setSaveDetails] =
    useState<NoteServerResponse<NoteDetails> | null>(null);
  const [pinnedNotes, setPinnedNotes] = useState<PinnedNote[]>([]);
  const { resetFlashcard, setFlashcardData } = useFlashcardWizard();

  const toast = useCustomToast();
  const params = useParams();

  const location = useLocation();
  const search = useSearchQuery();
  const shareable = search.get('shareable');
  const apiKey = search.get('apiKey');

  const [noteParamId, setNoteParamId] = useState<string | null>(null);
  const [openTags, setOpenTags] = useState<boolean>(false);
  const [openFlashCard, setOpenFlashCard] = useState<boolean>(false);
  const [noteId, setNoteId] = useState<any | null>(null);
  const [saveButtonState, setSaveButtonState] = useState<boolean>(true);
  const [editedTitle, setEditedTitle] = useState(defaultNoteTitle);
  const editedTitleRef = useRef<any>(null);
  const draftNoteId = useRef<any>();
  const [currentTime, setCurrentTime] = useState<string>(
    formatDate(new Date())
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>('');
  const [editorStyle, setEditorStyle] = useState<any>({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [canStartSaving, setCanStartSaving] = useState(false);
  const [openSideModal, setOpenSideModal] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(true);
  const [callTimerCallback, setCallTimerCallback] = useState(false);

  const [editor] = useLexicalComposerContext();

  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState<string[]>([]);
  const [newTags, setNewTags] = useState<string[]>(tags);
  const [inputValue, setInputValue] = useState('');

  const inputContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [loadingDoc, setLoadingDoc] = useState(false);
  const { userDocuments, user, hasActiveSubscription } = userStore();
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [pinned, setPinned] = useState<boolean>(false);
  const [cloneInProgress, setCloneInProgress] = useState(false);
  const debounceEditedTitle = useDebounce(editedTitle, 1000);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [togglePlansModal, setTogglePlansModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsEditorLoaded(true);
    }, 10000);
  }, []);

  const onCancel = () => {
    setDeleteNoteModal(!deleteNoteModal);
  };

  const onDeleteNoteBtn = () => {
    setDeleteNoteModal(true);
  };

  const downloadAsPDF = async () => {
    if (editor.getEditorState().isEmpty()) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Cannot download note. Please select a note',
        'error'
      );
    }

    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      saveHTMLAsPDF(editedTitle, htmlString);
    });
  };

  const onSaveNote = async () => {
    if (!editor) return;

    setIsSavingNote(true);

    // get editor's content
    let noteJSON = '';

    try {
      const editorJson = await editor?.getEditorState().toJSON();
      noteJSON = JSON.stringify(editorJson);
    } catch (error: any) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Oops! Could not get note content',
        'error'
      );
    }

    if (!editedTitle || editedTitle === defaultNoteTitle) {
      return showToast(UPDATE_NOTE_TITLE, 'Enter note title', 'error');
    }
    if (!editorHasContent()) {
      return showToast(UPDATE_NOTE_TITLE, 'Note is empty', 'error');
    }

    setSaveButtonState(false);

    let saveDetails: NoteServerResponse<NoteDetails> | null;

    const data: NoteData = {
      topic: editedTitle,
      note: noteJSON,
      status: NoteStatus.SAVED
    };

    const unionTags = union(newTags, tags);

    if (!isEmpty(unionTags)) data.tags = unionTags;

    if (!isNil(noteId) || !isEmpty(noteId)) {
      saveDetails = await updateNote(noteId, data as NoteData);
    } else {
      saveDetails = await createNote(data as NoteData);
    }
    if (isNil(saveDetails)) {
      setSaveButtonState(true);
      return showToast(
        UPDATE_NOTE_TITLE,
        'An unknown error occurs while updating note. Try again',
        'error'
      );
    }
    if (saveDetails?.error) {
      setSaveButtonState(true);
      return showToast(UPDATE_NOTE_TITLE, saveDetails?.error, 'error');
    } else {
      if (isEmpty(saveDetails?.data) || isNil(saveDetails?.data)) {
        setSaveButtonState(true);
        return showToast(
          UPDATE_NOTE_TITLE,
          'Could not get note data, please try again',
          'error'
        );
      }
      // Save noteID to state if this is a new note and save locally
      if (isEmpty(noteId)) {
        const newNoteId = saveDetails?.data['_id'];
        setNoteId(newNoteId);
        saveNoteLocal(getLocalStorageNoteId(newNoteId), saveDetails?.data.note);
      } else {
        saveNoteLocal(getLocalStorageNoteId(noteId), saveDetails.data.note);
      }
      // save note details and other essential params
      setSaveDetails(saveDetails);
      setCurrentTime(formatDate(saveDetails?.data.updatedAt));
      setIsSavingNote(false);
      showToast(UPDATE_NOTE_TITLE, saveDetails?.message, 'success');
      setSaveButtonState(true);
      // ingest Note content
      ingestNote(saveDetails?.data);

      // handleCloseAllToast();
    }
  };

  const onDeleteNote = async () => {
    const noteIdInUse = noteId ?? noteParamId;

    if (isEmpty(noteIdInUse)) {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }
    setIsLoading(true);

    const details = await deleteNote(noteIdInUse);
    setIsLoading(false);
    if (isEmpty(details) || isNil(details)) {
      setDeleteNoteModal(false);
      return showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding note. Try again',
        'error'
      );
    }

    if (details.error) {
      setDeleteNoteModal(false);
      return showToast(DELETE_NOTE_TITLE, details.error, 'error');
    } else {
      // Remove the deleted note from pinned notes in local storage
      const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
      if (pinnedNotesFromLocalStorage) {
        const updatedPinnedNotes = pinnedNotesFromLocalStorage.filter(
          (pinnedNote) => pinnedNote.noteId !== noteIdInUse
        );
        savePinnedNoteLocal(updatedPinnedNotes);
      }
      setDeleteNoteModal(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setEditedTitle(defaultNoteTitle);
      // deleteNoteLocal(noteId);
      // deleteNoteLocal('');
      setNoteId('');
      clearEditor();
      handleBackClick();
    }
  };

  const getNoteById = async (
    paramsIdForNote = noteParamId,
    apiKey: string | null = null,
    callback = null
  ) => {
    if (isEmpty(paramsIdForNote) || isNil(paramsIdForNote)) {
      return;
    }
    if (apiKey) {
      const resp = await ApiService.getNoteForAPIKey(
        paramsIdForNote as string,
        apiKey
      );

      const respText = await resp.text();
      try {
        const respDetails: NoteServerResponse<{ data: NoteDetails }> =
          JSON.parse(respText);

        const emptyRespDetails =
          isEmpty(respDetails) ||
          isNil(respDetails) ||
          isEmpty(respDetails.data) ||
          isNil(respDetails.data);
        if (respDetails.error || emptyRespDetails) {
          showToast(
            UPDATE_NOTE_TITLE,
            respDetails.error ?? respDetails.message
              ? respDetails.message
              : 'Cannot load note details',
            'error'
          );
          return;
        }
        if (!isEmpty(respDetails.data)) {
          const { data: note } = respDetails.data;
          if (note._id && note.topic && note.note) {
            setEditedTitle(note.topic);
            setCurrentTime(formatDate(note.updatedAt));
            setInitialContent(note.note);
            setSaveDetails({ ...respDetails, data: respDetails.data.data });
            setNoteId(note._id);
            setTags(note.tags);
            if (typeof callback === 'function') {
              callback();
            }
          }
        }
        // set note data
      } catch (error: any) {
        showToast(UPDATE_NOTE_TITLE, error.message, 'error');
        return;
      }
    } else {
      const resp = await ApiService.getNote(paramsIdForNote as string);

      const respText = await resp.text();
      try {
        // console.log('data =========>>> ', respText);
        const respDetails: NoteServerResponse<{ data: NoteDetails }> =
          JSON.parse(respText);

        const emptyRespDetails =
          isEmpty(respDetails) ||
          isNil(respDetails) ||
          isEmpty(respDetails.data) ||
          isNil(respDetails.data);
        if (respDetails.error || emptyRespDetails) {
          showToast(
            UPDATE_NOTE_TITLE,
            respDetails.error ?? respDetails.message
              ? respDetails.message
              : 'Cannot load note details',
            'error'
          );
          return;
        }
        if (!isNil(respDetails?.data)) {
          const { data: note } = respDetails.data;
          if (note._id && note.topic && note.note) {
            setEditedTitle(note.topic);
            setCurrentTime(formatDate(note.updatedAt));
            setInitialContent(note.note);
            setSaveDetails({ ...respDetails, data: respDetails.data.data });
            setNoteId(note._id);
            setTags(note.tags);
            if (typeof callback === 'function') {
              callback();
            }
          }
        }
        // set note data
      } catch (error: any) {
        showToast(UPDATE_NOTE_TITLE, error.message, 'error');
        return;
      }
    }
  };

  const handleTitleChange = (event: any) => {
    setIsEditingTitle(true);
    const value = event.target.value;
    setEditedTitle(value);
  };

  const updateTitle = async () => {
    setIsEditingTitle(false);
    if (!isEmpty(editedTitle.trim())) {
      setEditedTitle(editedTitle.trim());
    } else {
      setEditedTitle(defaultNoteTitle);
    }
  };

  const savePinnedNoteLocal = (pinnedNotesArray: any) => {
    const storageId = 'pinned_notes'; // Unique identifier for the array in local storage
    localStorage.setItem(storageId, JSON.stringify(pinnedNotesArray));
  };

  const unPinNote = async () => {
    const noteIdInUse = noteId;
    if (!noteIdInUse || noteIdInUse === '') {
      return showToast(DELETE_NOTE_TITLE, 'No note  to unpin', 'warning');
    }
    try {
      // Remove the deleted note from the dataSource
      const storageId = NoteEnums.PINNED_NOTE_STORE_ID;

      localStorage.removeItem(storageId);

      const filtedPinnedNote = filter(pinnedNotes as any[], (pinnedNote) => {
        if (noteIdInUse === pinnedNote?.notedId) return pinnedNote;
      });

      setPinnedNotes(filtedPinnedNote as any[]);

      showToast(DELETE_NOTE_TITLE, 'Note unpinned', 'success');
      setPinned(false);
    } catch (error: any) {
      showToast(DELETE_NOTE_TITLE, error.message, 'error');
    }
  };

  const pinNote = () => {
    if (!saveDetails) {
      return showToast(
        UPDATE_NOTE_TITLE,
        'Please ensure note is loaded ',
        'error'
      );
    }

    // Save the note to local storage when pinned
    if (saveDetails?.data) {
      if (isNoteAlreadyPinned(saveDetails.data._id)) {
        unPinNote();
        return;
      }

      const updatedPinnedNotes = [
        ...pinnedNotes,
        {
          noteId: saveDetails?.data['_id'],
          pinnedNoteJSON: saveDetails
        }
      ];
      setPinnedNotes(updatedPinnedNotes);
      savePinnedNoteLocal(updatedPinnedNotes);
      setPinned(true);
      return showToast(UPDATE_NOTE_TITLE, 'Note pinned', 'success');
    }
  };

  // Function to toggle pin state when the pin icon is clicked
  const handlePinClick = () => {
    pinNote();
  };

  const isNoteAlreadyPinned = (noteId: string): boolean => {
    for (const note of pinnedNotes) {
      if (note.noteId === noteId) {
        setPinned(true);
        return true;
      }
    }
    return false;
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

  const handleFocusOut = () => {
    // Check if the click event target is inside the inputContainerRef
    if (
      inputContainerRef.current &&
      !inputContainerRef.current.contains(document.activeElement as Node) // Type assertion here
    ) {
      updateTitle();
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      updateTitle();
    }
  };

  const handleHeaderClick = () => {
    if (editedTitle === defaultNoteTitle) {
      setEditedTitle('');
    }
    setIsEditingTitle(true);
  };

  const editorHasContent = (): boolean => {
    if (!editor) {
      return false;
    }
    let contentFound = false;
    editor.update(() => {
      const root = $getRoot();

      const children = root.getChildren();

      if (!isEmpty(children)) {
        contentFound = true;
      }
    });

    return contentFound;
  };

  const clearEditor = () => {
    if (editor.getEditorState().isEmpty()) {
      return false;
    }

    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    editor.focus();
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
      title: description ?? title,
      status: status,
      position: position,
      duration: duration,
      isClosable: isClosable
    });
  };

  const toggleEditorView = () => {
    if (!editorStyle) {
      setEditorStyle({
        position: 'absolute',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1000
      });
      setIsFullScreen(true);
    } else {
      setEditorStyle(null);
      setIsFullScreen(false);
    }
  };

  const handleWindowKey = (event: any) => {
    if (event && event.key) {
      const eventValue = event.key as string;
      if (eventValue.toLowerCase() === 'escape' && editorStyle) {
        // editor is in full screen mode. we must close editor
        toggleEditorView();
      }
    }
  };

  const showTagsDropdown = () => {
    setOpenTags((prev) => !prev);
  };

  const showFlashCardDropdown = () => {
    resetFlashcard();
    setFlashcardData((prev) => ({
      ...prev,
      deckname: '',
      studyType: '',
      studyPeriod: '',
      numQuestions: 0,
      timerDuration: '',
      hasSubmitted: false,
      noteDoc: noteParamId as string
    }));
    setOpenSideModal(true);
  };

  const goToNoteChat = async (
    noteUrl: string,
    noteTitle: string,
    noteId: any
  ) => {
    const query = encodeQueryParams({
      noteId,
      sid: user._id
    });
    try {
      navigate(`/dashboard/docchat${query}`);
    } catch (error) {
      setLoadingDoc(false);
    }
  };

  const proceed = async () => {
    if (!saveDetails || !saveDetails.data) {
      return showToast(DEFAULT_NOTE_TITLE, 'Note not loaded', 'warning');
    }
    setLoadingDoc(true);
    const note = saveDetails.data;
    const url = note.documentId ?? '';
    const topic = note.topic;
    const noteId = note.id;
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToNoteChat(url, topic, noteId);
    } catch (error) {
      // Handle error
    } finally {
      setLoadingDoc(false);
    }
  };

  const dropDownOptions = [
    {
      id: 1,
      leftIcon: <FlashCardIcn />,
      title: 'Flashcards',
      rightIcon: <ArrowRight />,
      onClick: showFlashCardDropdown
    },
    {
      id: 2,
      leftIcon: <AddTag />,
      title: 'Add tag',
      rightIcon: <ArrowRight />,
      onClick: showTagsDropdown
    },
    {
      id: 3,
      leftIcon: <SideBarPinIcn />,
      title: 'Pin to sidebar',
      rightIcon: <ArrowRight />,
      onClick: handlePinClick
    },
    {
      id: 4,
      leftIcon: (
        <StyledImage className={'mx-2'}>
          <IoChatboxEllipsesOutline />
        </StyledImage>
      ),
      title: loadingDoc ? 'Uploading...' : 'Doc Chat',
      rightIcon: <ArrowRight />,
      onClick: proceed
    },
    {
      id: 5,
      leftIcon: <DownloadIcon />,
      title: 'Download',
      rightIcon: <ArrowRight />,
      onClick: downloadAsPDF
    },
    {
      id: 6,
      leftIcon: <TrashIcon />,
      title: 'Delete',
      onClick: onDeleteNoteBtn
    }
  ];

  const addTag = async (
    id: string,
    tags: string[]
  ): Promise<NoteServerResponse | null> => {
    const data = { tags: tags };
    // const resp = await ApiService.updateNoteTags(id, data);
    const resp = await ApiService.storeNotesTags(id, tags);
    const respText = await resp.text();
    try {
      const respDetails: NoteServerResponse = JSON.parse(respText);
      return respDetails;
    } catch (error: any) {
      return { error: error.message, message: error.message };
    }
  };

  const AddTags = async () => {
    const noteIdInUse = defaultTo(noteId, noteParamId);

    if (editedTitle === '' || editedTitle === defaultNoteTitle) {
      // simply save the note title
      setOpenTags(false);
      return;
    }
    if (isEmpty(noteIdInUse)) {
      setOpenTags(false);
      return showToast(DELETE_NOTE_TITLE, 'No note selected', 'error');
    }

    const details = await addTag(noteIdInUse, newTags);

    if (isEmpty(details) || isNil(details)) {
      setOpenTags(false);
      showToast(
        DELETE_NOTE_TITLE,
        'An unknown error occurs while adding tag. Try again',
        'error'
      );
      return;
    } else if (details.error) {
      setOpenTags(false);
      showToast(DELETE_NOTE_TITLE, details.error, 'error');
      return;
    } else {
      setOpenTags(false);
      showToast(DELETE_NOTE_TITLE, details.message, 'success');
      setTags(union(details.data.tags, [...tags, ...newTags]));
    }
  };

  const handleAddTag = () => {
    const value = inputValue.toLowerCase().trim();
    if (inputValue && !newTags.includes(value)) {
      setNewTags([...newTags, value]);
    }
    setInputValue('');
  };

  const handleBackClick = () => {
    try {
      setCanStartSaving(false);
      deleteNoteLocal(noteId);
      deleteNoteLocal('');
      setNoteId('');
      clearEditor();
    } catch (error) {
      // console.log('handleBackClick ------->>> error ============>>> ', error);
    } finally {
      setTimeout(() => {
        navigate(-1);
      }, 100);
    }
  };

  /**
   * Ingest note content. This sends the note content to the AI service for processing
   */
  const ingestNote = async (noteDetails: NoteDetails) => {
    const noteArrayContent = [noteDetails.note];
  };

  /**
   * Auto-save note contents
   *
   * @returns
   */
  const autoSaveNote = async (
    editor: EditorType,
    saveCallback: (noteId: string, note: string) => any
  ) => {
    if (!editor) return;
    if (editor.getEditorState().isEmpty()) return;

    const noteTitle =
      !isEmpty(editedTitleRef?.current?.value) &&
      !isNil(editedTitleRef?.current?.value)
        ? editedTitleRef?.current?.value
        : editedTitle;

    let noteIdToUse = '';
    let draftNoteIdToUse = '';
    let noteJSON = '';
    let noteStatus: NoteStatus;

    try {
      const editorJson = editor?.getEditorState().toJSON();
      noteJSON = JSON.stringify(editorJson);
    } catch (error: any) {
      return;
    }
    setIsSavingNote(true);
    if (!isEmpty(noteId) || !isEmpty(noteParamId)) {
      noteIdToUse = defaultTo(noteId, noteParamId);
      noteStatus = NoteStatus.SAVED;
    } else {
      draftNoteIdToUse =
        draftNoteId?.current && draftNoteId?.current?.value
          ? draftNoteId.current.value
          : '';
      noteStatus = NoteStatus.DRAFT;
    }

    const idToUse =
      !isEmpty(noteIdToUse) && !isNil(noteIdToUse)
        ? noteIdToUse
        : !isEmpty(draftNoteIdToUse) && !isNil(draftNoteIdToUse)
        ? draftNoteIdToUse
        : false;

    const data: {
      topic?: string;
      note: string;
      status: string;
      tags?: string[];
    } = {
      note: noteJSON,
      status: noteStatus
    };

    const unionTags = union(newTags, tags);

    if (!isEmpty(unionTags)) data.tags = unionTags;

    if (!isEmpty(noteTitle)) data.topic = noteTitle;

    if (idToUse) {
      updateNote(noteIdToUse, data as NoteData).then((updatedDetails) => {
        saveCallback(noteIdToUse, noteJSON);
        setIsSavingNote(false);
        setCurrentTime(formatDate(updatedDetails.data.updatedAt));
      });
    } else {
      // create a new draft note
      createNote(data as NoteData).then((saveDetails) => {
        // save new draft note details for update
        if (saveDetails?.data) {
          setNoteId(saveDetails.data['_id']);
          setNoteParamId(saveDetails.data['_id']);
          saveCallback(draftNoteIdToUse, noteJSON);
          setCurrentTime(formatDate(saveDetails.data.updatedAt));
          setIsSavingNote(false);
          setSaveDetails(saveDetails);
          draftNoteId.current.value = saveDetails.data['_id'];
        }
      });
    }
    // handleCloseAllToast();
  };
  const handleAutoSave = (editor: EditorType) => {
    // TODO: we must move this to web worker
    // additional condition for use to save note details
    const saveLocalCallback = (noteId: string, note: string) => {
      saveNoteLocal(getLocalStorageNoteId(noteId), note);
    };

    autoSaveNote(editor, saveLocalCallback);
  };

  // Load notes if noteID is provided via param
  useEffect(() => {
    // event for escape to minimize window
    window.addEventListener('keypress', handleWindowKey);
    return () => {
      window.removeEventListener('keypress', handleWindowKey);
      clearEditor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      setPinnedNotes(pinnedNotesFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(params?.id)) {
      setNoteParamId(params?.id as string);
    } else {
      clearEditor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userDocuments.length) {
      setStudentDocuments(userDocuments);
    }
  }, [userDocuments]);

  useEffect(() => {
    if (
      editedTitleRef.current &&
      editedTitle !== editedTitleRef.current.value
    ) {
      if (isEmpty(editedTitle)) return;
      // if (canStartSaving) {
      editedTitleRef.current.value = editedTitle;
      resetTimer();
      // handleAutoSave(editor);
      return;
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceEditedTitle]);

  const { resetTimer } = useTimer({
    sendOnce: false,
    timestamp: 2,
    timerCallback: (value) => setCallTimerCallback(value)
  });

  const cloneNoteHandler = async () => {
    setCloneInProgress(true);
    try {
      const d = await ApiService.cloneNote(noteId);
      const data = await d.json();
      toast({
        position: 'top-right',
        title: `Note Cloned Succesfully`,
        status: 'success'
      });
      setCloneInProgress(false);
      setTimeout(() => {
        navigate(`/dashboard/notes/new-note/${data.data._id}`);
      }, 200);
    } catch (error) {
      setCloneInProgress(false);
      toast({
        position: 'top-right',
        title: `Problem cloning note, please try again later!`,
        status: 'error'
      });
    }
  };

  useEffect(() => {
    if (callTimerCallback) {
      handleAutoSave(editor);
    }
    setCallTimerCallback(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callTimerCallback, editedTitleRef]);

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        resetTimer();
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, canStartSaving, tags]);

  useEffect(() => {
    (async () => {
      if (!isEmpty(noteParamId) || !isNil(noteParamId)) {
        if (shareable && shareable.length > 0 && apiKey && apiKey.length > 0) {
          setIsEditorLoaded(false);

          // setInitialContent(getNoteLocal(noteParamId) as string);
          await getNoteById(noteParamId, apiKey, () => {
            setTimeout(() => {
              setCanStartSaving(true);
              setIsEditorLoaded(true);
            });
          });
          setTimeout(() => {
            setCanStartSaving(true);
            setIsEditorLoaded(true);
          });
          editor.setEditable(false);

          // ideally clean all this up
          const inputElements = document.querySelectorAll('input');

          // Disable each input element on the page
          inputElements.forEach((input) => {
            input.disabled = true;
          });
          window.addEventListener('click', () => {
            setTogglePlansModal(true);
          });
        } else {
          const token = await firebaseAuth.currentUser?.getIdToken();

          if (!token) {
            navigate('/signup');
          }
        }
        setIsEditorLoaded(false);
        // setInitialContent(getNoteLocal(noteParamId) as string);
        await getNoteById(noteParamId, null, () => {
          setTimeout(() => {
            setCanStartSaving(true);
            setIsEditorLoaded(true);
          });
        });
        setTimeout(() => {
          setCanStartSaving(true);
          setIsEditorLoaded(true);
        });
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteParamId]);

  useEffect(() => {
    // const initialValue =
    //   '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';
    // const editorState = editor.parseEditorState(initialValue);
    // editor.setEditorState(editorState);
    if (
      isString(initialContent) &&
      !isEmpty(initialContent) &&
      !isNil(initialContent)
    ) {
      const editorState = editor.parseEditorState(initialContent);
      if (!editorState.isEmpty()) {
        editor.setEditorState(editorState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);
  if (apiKey) {
    const ed: HTMLDivElement = document.querySelector('.ContentEditable__root');
    if (ed) {
      const children: HTMLCollectionOf<Element> = ed.children;
      // Apply user-select: none to each child element
      for (const child of children) {
        (child as HTMLElement).style.userSelect = 'none';
      }
    }
  }
  // Header Component
  const HeaderComponent = () => {
    return (
      <HeaderWrapper
        className={clsx(
          'flex items-center flex-start relative w-[95%] lg:w-[98%] 2xl:w-full mx-auto',
          {
            'opacity-40 pointer-events-none': !isEditorLoaded
          }
        )}
      >
        <div style={{ display: 'none' }}>
          <input type="text" ref={editedTitleRef} />
          <input type="text" ref={draftNoteId} />
        </div>

        <Header
          className={clsx(
            'bg-[#fafafa] border-[#eeeff2] border flex w-full p-2 justify-between'
          )}
        >
          <FirstSection>
            <Box
              className="zoom__icn hover:opacity-75 hidden md:block"
              onClick={toggleEditorView}
            >
              {isFullScreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                >
                  <path
                    d="M15.4997 4.41667H19.1663V6.25H13.6663V0.75H15.4997V4.41667ZM6.33301 6.25H0.833008V4.41667H4.49967V0.75H6.33301V6.25ZM15.4997 13.5833V17.25H13.6663V11.75H19.1663V13.5833H15.4997ZM6.33301 11.75V17.25H4.49967V13.5833H0.833008V11.75H6.33301Z"
                    fill="#7E8591"
                  />
                </svg>
              ) : (
                <ZoomIcon />
              )}
            </Box>
            <div onClick={handleHeaderClick} ref={inputContainerRef}>
              <div className="doc__name">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    onBlur={handleFocusOut}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                ) : (
                  <span>{truncate(editedTitle, { length: 40 })}</span>
                )}
              </div>
            </div>
            <div className="timestamp">
              {isSavingNote ? <p>Saving....</p> : <p>Updated {currentTime}</p>}
            </div>
          </FirstSection>
          <SecondSection>
            {user && hasActiveSubscription && apiKey && (
              <Button
                leftIcon={<Icon as={RiRemoteControlLine} fontSize={'16px'} />}
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="8px"
                fontSize="16px"
                bg="#f4f4f5"
                color="#000"
                w={'180px'}
                h={'40px'}
                onClick={cloneNoteHandler}
                _hover={{ bg: '#e4e4e5' }}
                _active={{ bg: '#d4d4d5' }}
              >
                Clone Notes
              </Button>
            )}
            {user && <ShareModal type="note" />}

            <CustomButton
              disabled={!saveButtonState || !user}
              isPrimary
              title={!saveButtonState ? 'Saving...' : 'Save'}
              type="button"
              onClick={onSaveNote}
              active={saveButtonState}
            />
            <div onClick={handlePinClick}>
              <BsFillPinFill
                className={`pin-icon ${
                  pinnedNotes.some((note) => note.noteId === noteId)
                    ? 'pinned'
                    : 'not-pinned'
                }`}
              />
            </div>
            <div>
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
                  zIndex={3}
                  fontSize="0.875rem"
                  minWidth={'185px'}
                  borderRadius="8px"
                  backgroundColor="#FFFFFF"
                  boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                >
                  <section>
                    {dropDownOptions?.map((dropDownOption) => (
                      <DropDownLists key={dropDownOption.id}>
                        <DropDownFirstPart
                          onClick={() =>
                            handleOptionClick(dropDownOption.onClick)
                          }
                        >
                          <div>
                            {dropDownOption.leftIcon}
                            <p
                              style={{
                                color:
                                  dropDownOption.title === 'Delete'
                                    ? '#F53535'
                                    : ''
                              }}
                            >
                              {dropDownOption.title}
                            </p>
                          </div>
                          <div>{dropDownOption.rightIcon}</div>
                        </DropDownFirstPart>
                      </DropDownLists>
                    ))}
                  </section>
                </MenuList>
              </Menu>

              {openTags && (
                <TagModal
                  onSubmit={AddTags}
                  isOpen={openTags}
                  onClose={() => setOpenTags(false)}
                  tags={tags}
                  inputValue={inputValue}
                  handleAddTag={handleAddTag}
                  newTags={newTags}
                  setNewTags={setNewTags}
                  setInputValue={setInputValue}
                />
              )}
            </div>
          </SecondSection>
        </Header>
      </HeaderWrapper>
    );
  };

  // CustomSideModal Component
  const CustomSideModalContent = () => {
    return (
      <div style={{ margin: '3rem 0', overflowY: 'auto' }}>
        <SetupFlashcardPage showConfirm isAutomated />
      </div>
    );
  };

  const CustomSideModalWrapper = ({ onClose, isOpen }) => {
    return (
      <CustomSideModal
        onClose={() => {
          onClose();
          resetFlashcard();
        }}
        isOpen={isOpen}
      >
        <CustomSideModalContent />
      </CustomSideModal>
    );
  };

  return (
    <StyledNoteWrapper
      h={'100dvh'}
      maxH={'calc(100dvh - 80px)'}
      overflowY="hidden"
      className={'_note-wrapper'}
    >
      <StyledNoteContainer
        className={clsx('_note-container', {
          'absolute inset-0 top-[13rem] bg-white z-10 transition-all max-h-[calc(100dvh-13rem)] overflow-y-hidden':
            isFullScreen
        })}
      >
        <StyledNoteContent className={'_note-content w-full h-full relative'}>
          <HeaderButton
            onClick={handleBackClick}
            className={clsx(
              'w-full max-w-[150px] hover:opacity-75 absolute left-0 top-5 z-10 hidden 2xl:flex cursor-pointer items-center',
              {
                '!max-w-[240px] px-4': isFullScreen,
                'opacity-40 pointer-events-none': !isEditorLoaded
              }
            )}
          >
            <BackArrow className="mx-2" />
            <HeaderButtonText className={clsx('text-[10pt]')}>
              {' '}
              Back
            </HeaderButtonText>
          </HeaderButton>
          <div className="max-w-[1100px] mx-auto">
            {isNil(location.state?.documentUrl) && <HeaderComponent />}
            <CustomSideModalWrapper
              onClose={() => setOpenSideModal(false)}
              isOpen={openSideModal}
            />
            {togglePlansModal && (
              <PlansModal
                message="Subscribe to unlock your AI Study Tools! 🚀"
                subMessage="One-click Cancel at anytime."
                togglePlansModal={togglePlansModal}
                setTogglePlansModal={setTogglePlansModal}
              />
            )}
            <NoteBody
              className={clsx(
                'mx-auto w-full flex justify-start items-center flex-col'
              )}
            >
              {location.state?.documentUrl ? (
                <TempPDFViewer
                  pdfLink={location.state.documentUrl}
                  name={location.state.docTitle}
                />
              ) : (
                <div
                  className={clsx('custom-scroll', 'w-full', {
                    'note-editor-test': false,
                    'opacity-40 pointer-events-none': !isEditorLoaded
                  })}
                >
                  <StyledEditor />
                </div>
              )}
            </NoteBody>

            <NoteModal
              title="Delete Note"
              description="This will permanently remove this note from your list."
              isLoading={isLoading}
              isOpen={deleteNoteModal}
              actionButtonText="Delete"
              onCancel={() => onCancel()}
              onDelete={() => onDeleteNote()}
              onClose={() => setDeleteNoteModal(false)}
            />
            {openFlashCard && (
              <FlashModal
                isOpen={openFlashCard}
                onClose={() => setOpenFlashCard(false)}
                title="Flash Card Title"
                loadingButtonText="Creating..."
                buttonText="Create"
                onSubmit={(noteId) => {
                  // unused
                }}
              />
            )}
          </div>
        </StyledNoteContent>
      </StyledNoteContainer>
    </StyledNoteWrapper>
  );
};

export default NewNote;
