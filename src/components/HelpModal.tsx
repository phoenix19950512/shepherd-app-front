import userStore from '../state/userStore';
import ViewHomeWorkHelpDetails from '../views/Dashboard/HomeWorkHelp/ViewHomeWorkHelpDetails';
import CustomButton from './CustomComponents/CustomButton';
import CustomModal from './CustomComponents/CustomModal/index';
import { StarIcon } from './icons';
import { SelectedNoteModal } from './index';
import { Text } from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getAuth } from 'firebase/auth';
import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';

interface ToggleProps {
  setToggleHelpModal: (state: boolean) => void;
  toggleHelpModal: boolean;
}

const HelpModal = ({ setToggleHelpModal, toggleHelpModal }: ToggleProps) => {
  const [showSelected, setShowSelected] = useState(false);
  const [openAceHomework, setAceHomeWork] = useState(false);
  const [actions1Visible, setActions1Visible] = useState(false);
  const [actions2Visible, setActions2Visible] = useState(false);
  const navigate = useNavigate();
  const { user }: any = userStore();
  const [subjectId, setSubject] = useState<string>('Subject');
  const [localData, setLocalData] = useState<any>({
    subject: subjectId,
    topic: ''
  });
  const [level, setLevel] = useState<any>('');

  const handleClose = useCallback(() => {
    setToggleHelpModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowSelected = () => {
    setShowSelected(true);
  };

  const handleAceHomeWorkHelp = useCallback(
    () => setAceHomeWork((prevState) => !prevState),
    [setAceHomeWork]
  );

  useEffect(() => {
    if (toggleHelpModal) {
      const actions1Timeout = setTimeout(() => {
        setActions1Visible(true);
      }, 100);

      const actions2Timeout = setTimeout(() => {
        setActions2Visible(true);
      }, 200);

      return () => {
        clearTimeout(actions1Timeout);
        clearTimeout(actions2Timeout);
      };
    }
  }, [toggleHelpModal]);

  const actions1 = [
    {
      id: 1,
      title: 'AI Tutor',
      description:
        'Stuck with your homework, Shepherd can guide you through it step by step for quick & easy completion',
      imageURL: '/images/ace-homework.svg',
      onClick: () => {
        handleClose();
        // handleAceHomeWorkHelp();
        navigate('/dashboard/ace-homework');
      }
    },
    {
      id: 2,
      title: 'Flashcards Factory',
      description:
        'Need a memory boost? Generate custom flashcards & mnemonics with Shepherd, making memorization a breeze',
      imageURL: '/images/flashcards.svg',
      onClick: () => {
        handleClose();
        navigate('/dashboard/flashcards/create');
      }
    },
    {
      id: 3,
      title: 'Doc-chat',
      showModal: true,
      description:
        'Want to make the most of your notes? Chat with them via Shepherd and uncover insights to boost your grasp ',
      imageURL: '/images/notes-navigator.svg',
      onClick: () => handleShowSelected()
    }
    // {
    //   id: 4,
    //   title: 'Test Prep',
    //   description:
    //     'Got a test coming? Shepherd has you covered with quizzes & prep resources priming you for the big day',
    //   imageURL: '/images/test.svg'
    // }
  ];

  const actions2 = [
    {
      id: 5,
      title: 'Deep Dives',
      description:
        'Struggling with a tricky topic? Let Shepherd simplify it for you with in-depth analysis & detailed explanations',
      imageURL: '/images/bulb.svg'
    },

    {
      id: 6,
      title: 'Research Assistant',
      showModal: false,
      description:
        'Delving into a research project? Let Shepherd find you the best resources & references for your work',
      imageURL: '/images/research-assistant.svg'
    },
    {
      id: 7,
      title: 'Study Roadmap',
      showModal: false,
      description:
        'Just starting school? Let Shepherd create a tailored study plan guiding you to academic success',
      imageURL: '/images/roadmap.svg',
      onClick: () => handleShowSelected()
    }
  ];

  const onRouteHomeWorkHelp = useCallback(() => {
    handleClose();
    handleAceHomeWorkHelp();
    navigate('/dashboard/ace-homework', {
      state: { subject: subjectId, topic: localData.topic, level }
    });
    setSubject('');
    setLocalData({});
  }, [
    subjectId,
    localData,
    level,
    handleClose,
    handleAceHomeWorkHelp,
    navigate
  ]);

  return (
    <>
      {toggleHelpModal && (
        <Transition.Root show={toggleHelpModal} as={Fragment}>
          <Dialog as="div" className="relative z-[800]" onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative mt-10 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-2xl sm:w-xl sm:max-w-3xl">
                    <div>
                      <div className="flex justify-between px-2 pb-2 align-middle border-b">
                        <div className="flex items-center p-3 pb-2 space-x-2">
                          <StarIcon
                            className="w-4 h-4 text-primaryBlue"
                            onClick={undefined}
                          />
                          <Typewriter
                            options={{
                              delay: 10,
                              autoStart: true,
                              loop: false,
                              skipAddStyles: true,
                              wrapperClassName: 'text-base font-semibold'
                            }}
                            onInit={(typewriter) => {
                              typewriter
                                .typeString(
                                  `Hi ${
                                    user?.name?.first || 'there'
                                  }, how can Shepherd make your study time more effective today?`
                                )
                                .start();
                            }}
                          />
                        </div>
                        <button
                          onClick={handleClose}
                          className="inline-flex items-center h-6 px-2 py-1 mt-4 mb-2 mr-4 space-x-1 text-xs font-medium bg-gray-100 rounded-full text-secondaryGray hover:bg-orange-200 hover:text-orange-600"
                        >
                          <span>Close</span>
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* <div className="p-6 pb-2 space-y-2 overflow-hidden bg-white sm:grid sm:grid-cols-4 sm:gap-x-4 sm:space-y-0 "> */}
                      <div className="w-full p-6 pt-3 mx-auto space-y-2 overflow-hidden bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0">
                        {actions1.map((action) => (
                          <div
                            key={action.title}
                            onClick={action.onClick}
                            className={`group cursor-pointer relative transform bg-white border-1 rounded-lg border-gray-300 p-4 hover:border-blue-500 focus:border-blue-500 action-card `}
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <Text className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </Text>
                              <p className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* <div className="overflow-hidden sm:w-[80%] w-full mx-auto p-6 pt-3  bg-white sm:grid sm:grid-cols-3 justify-items-center sm:gap-x-4 sm:space-y-0 space-y-2">
                        {actions2.map((action) => (
                          <div
                            onClick={action.onClick}
                            key={action.title}
                            className={`group cursor-pointer relative transform bg-white border-1 rounded-lg border-gray-300 p-4 focus-within:border-blue-500 hover:border-blue-500 action-card`}
                          >
                            <div>
                              <img src={action.imageURL} alt={action.title} />
                            </div>
                            <div className="mt-4">
                              <Text className="text-base font-semibold leading-6 text-orange-400">
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.title}
                              </Text>
                              <Text className="mt-2 text-sm text-secondaryGray">
                                {action.description}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      {showSelected && (
        <SelectedNoteModal
          show={showSelected}
          setShow={setShowSelected}
          setShowHelp={setToggleHelpModal}
        />
      )}
      {/* {openAceHomework && (
        <ViewHomeWorkHelpDetails
          openAceHomework={openAceHomework}
          handleClose={handleClose}
          handleAceHomeWorkHelp={handleAceHomeWorkHelp}
          setSubject={setSubject}
          subjectId={subjectId}
          setLocalData={setLocalData}
          setLevel={setLevel}
          localData={localData}
          level={level}
          onRouteHomeWorkHelp={onRouteHomeWorkHelp}
        />
      )} */}
    </>
  );
};

export default HelpModal;
