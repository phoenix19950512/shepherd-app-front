import CustomModal from '../CustomComponents/CustomModal';
import { DownloadIcon, FlashCardsIcon } from '../icons';
import { DeleteNoteModal } from '../index';
import SelectableTable, { TableColumn } from '../table';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Menu,
  MenuList,
  MenuButton,
  Badge,
  Button,
  Box,
  Text,
  Flex,
  Divider,
  VStack
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import moment from 'moment';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { AiFillStar } from 'react-icons/ai';
import { FaEllipsisH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: number;
  name: string;
  subject: string;
  start_date: string;
  end_date: string;
  status: string;
  amount_earned: string;
  classes: string;
  rating: number;
}

const getNotes = JSON.parse(localStorage.getItem('notes') as string) || [];

const clients: Client[] = getNotes;

type DataSourceItem = {
  id: number;
  name: string;
  subject: string;
  topic: string;
  status: any;
  quizScore: string;
  flashcardScore: string;

  timeSpent: string;
};

const StudentPerformanceTab = (props) => {
  const { performanceReport } = props;
  const [deleteNoteModal, setDeleteNoteModal] = useState(false);
  const [, setDeleteAllNotesModal] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [clientsDetails, setClientDetails] = useState('');
  const [clientName, setClientName] = useState('');
  const [openTags, setOpenTags] = useState<boolean>(false);

  const navigate = useNavigate();
  console.log(performanceReport);

  const dataSource: DataSourceItem[] = Array.from(
    { length: performanceReport?.data?.length },
    (_, i) => {
      // Define variables for background color and text color
      let bgColor = '';
      let textColor = '';
      let text = '';

      // Set background color and text color based on status
      switch (performanceReport.data[i]?.status) {
        case 'notStarted':
          bgColor = '#FEF0F0';
          textColor = '#F53535';
          text = 'NOT STARTED';
          break;
        case 'inProgress':
          bgColor = '#FFF2EB';
          textColor = '#FB8441';
          text = 'IN PROGRESS';

          break;
        default:
          bgColor = '#F1F9F1';
          textColor = '#66BD6A';
          text = 'COMPLETE';

          break;
      }

      return {
        key: i,
        id: performanceReport.data[i]?._id,
        name: `${performanceReport.data[i]?.studyPlan.title} `,
        subject: performanceReport.data[i]?.studyPlan?.course?.label,
        topic: performanceReport.data[i]?.topic?.label,
        status: (
          <Badge bg={bgColor} color={textColor} p={1} fontWeight="500">
            {text}
          </Badge>
        ),
        quizScore: `${performanceReport.data[i]?.quizReadinessScore}%`,
        flashcardScore: `${performanceReport.data[i]?.flashcardReadinessScore}%`,
        timeSpent: `${performanceReport.data[i]?.aggregateStudyTime.replace(
          'Minutes',
          'min'
        )}`
      };
    }
  );
  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < clients.length;
    setChecked(selectedPeople.length === clients.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  function toggleAll() {
    setSelectedPeople(checked || indeterminate ? [] : clients);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const onDeleteNote = (isOpenDeleteModal: boolean, noteDetails: string) => {
    setDeleteNoteModal(isOpenDeleteModal);
    setClientDetails(noteDetails);
  };

  //function to render stars based on the rating value

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconContext.Provider
          key={i}
          value={{ color: i <= rating ? 'gold' : 'gray', size: '2em' }}
        >
          <AiFillStar />
        </IconContext.Provider>
      );
    }
    return stars;
  };

  const onClientReview = (name) => {
    setClientName(name);
    openReviewModal();
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'name',
      title: 'Plan Name',
      dataIndex: 'name',
      align: 'left',
      id: 1
      // render: ({ name }) => (
      //   <>
      //     <Flex alignItems="center" gap={1}>
      //       <img
      //         src="/svgs/text-document.svg"
      //         className="text-gray-400 "
      //         alt=""
      //       />
      //       <Text fontWeight="500">{name}</Text>
      //     </Flex>
      //   </>
      // )
    },
    {
      key: 'subject',
      title: 'Subject',
      dataIndex: 'subject',
      align: 'left',
      id: 2
    },
    {
      key: 'topic',
      title: 'Topic',
      dataIndex: 'topic',
      align: 'left',
      id: 3
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      id: 4
    },
    {
      key: 'quizScore',
      title: 'Quizzes',
      dataIndex: 'quizScore',
      align: 'center',
      id: 5
    },
    {
      key: 'flashcardScore',
      title: 'Flashcards',
      dataIndex: 'flashcardScore',
      align: 'center',
      id: 6
    },
    {
      key: 'timeSpent',
      title: 'Time Spent',
      dataIndex: 'timeSpent',
      align: 'center',
      id: 7
    }
  ];

  const {
    isOpen: isReviewModalOpen,
    onOpen: openReviewModal,
    onClose: closeReviewModal
  } = useDisclosure();

  // // Handler to open the modal when the "Client review" button is clicked
  // const openReviewModal = () => {
  //   onOpen();
  // };
  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-8 z-10">
            <div className="relative">
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

      {/* <CustomModal
        modalTitle=""
        isModalCloseButton
        onClose={() => setDeleteNoteModal(false)}
        isOpen={deleteNoteModal}
        modalSize="md"
        style={{ height: '327px', maxWidth: '100%' }}
      >
        <DeleteNoteModal
          title={clientsDetails}
          // deleteNoteModal={deleteNoteModal}
          setDeleteNoteModal={setDeleteNoteModal}
        />
      </CustomModal> */}
    </div>
  );
};

export default StudentPerformanceTab;
