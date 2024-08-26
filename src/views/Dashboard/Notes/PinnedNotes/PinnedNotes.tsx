import { SelectedNoteModal } from '../../../../components';
import CustomTabs from '../../../../components/CustomComponents/CustomTabs';
import LoaderOverlay from '../../../../components/loaderOverlay';
import { Header, NotesWrapper, Section, StyledHeader, Text } from '../styles';
import { PinnedNoteDetails } from '../types';
import PinnedNotesTab from './PinnedNotesTab';
import { useEffect, useState } from 'react';

const tabLists = [
  {
    id: 1,
    title: 'Pinned Notes'
  }
];

const PinnedNotes = () => {
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const [allPinnedNotes, setAllPinnedNotes] = useState<
    Array<PinnedNoteDetails>
  >([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Define the type for the pinned note
  type PinnedNote = {
    noteId: string | null;
    pinnedNoteJSON: any;
  };

  // Helper function to convert PinnedNote to PinnedNoteDetails
  const convertToPinnedNoteDetails = (
    pinnedNote: PinnedNote
  ): PinnedNoteDetails => {
    // Extract properties from pinnedNote.pinnedNoteJSON
    const {
      data: { topic, note, tags, createdAt, updatedAt, user }
    } = pinnedNote.pinnedNoteJSON;
    return {
      user: user || {},
      topic: topic || '',
      note: note || '',
      tags: tags || [],

      _id: pinnedNote.noteId || '',
      createdAt: new Date(createdAt) || new Date(),
      updatedAt: new Date(updatedAt) || new Date()
    };
  };

  // Function to get pinned notes from local storage
  const getPinnedNotesFromLocalStorage = (): PinnedNote[] => {
    const storageId = 'pinned_notes';
    const pinnedNotesString = localStorage.getItem(storageId);
    try {
      if (pinnedNotesString) {
        const parsedPinnedNotes = JSON.parse(pinnedNotesString);
        if (Array.isArray(parsedPinnedNotes)) {
          return parsedPinnedNotes;
        }
      }
    } catch (error) {
      // console.error('Error parsing pinned notes from local storage:', error);
    }
    return [];
  };

  const tabPanel = [
    {
      id: 1,
      component: <PinnedNotesTab data={allPinnedNotes} />
    }
  ];

  useEffect(() => {
    const pinnedNotesFromLocalStorage = getPinnedNotesFromLocalStorage();
    if (pinnedNotesFromLocalStorage) {
      const convertedPinnedNotes = pinnedNotesFromLocalStorage.map(
        convertToPinnedNoteDetails
      );
      setAllPinnedNotes((prevPinnedNotes) => [
        ...prevPinnedNotes,
        ...convertedPinnedNotes
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PinnedNoteView = () => {
    if (loadingNotes) {
      return <>{loadingNotes && <LoaderOverlay />}</>;
    } else {
      return (
        <>
          {allPinnedNotes.length > 0 ? (
            <NotesWrapper>
              <header className="flex justify-between my-4">
                <StyledHeader>
                  <span className="font-bold">Pinned Notes</span>
                  <span className="count-badge">{allPinnedNotes.length}</span>
                </StyledHeader>
              </header>
              <CustomTabs tablists={tabLists} tabPanel={tabPanel} />
            </NotesWrapper>
          ) : (
            <NotesWrapper>
              <Header>
                <StyledHeader>
                  <span className="font-bold">My Pinned Notes</span>
                </StyledHeader>
              </Header>
              <Section>
                <div>
                  <img src="/images/notes.png" alt="notes" />
                  <Text>You don't have any pinned notes yet!</Text>
                </div>
              </Section>
            </NotesWrapper>
          )}
          <SelectedNoteModal
            show={toggleHelpModal}
            setShow={setToggleHelpModal}
            setShowHelp={setToggleHelpModal}
          />
        </>
      );
    }
  };

  return <PinnedNoteView />;
};

export default PinnedNotes;
