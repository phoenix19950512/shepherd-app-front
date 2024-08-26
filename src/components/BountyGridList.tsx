import ApiService from '../services/ApiService';
import offerStore from '../state/offerStore';
import ApplyBountyModal from '../views/Dashboard/components/ApplyBounty';
import Pagination from '../views/Dashboard/components/Pagination';
import BountyCard from './BountyCard';
import StudentCard from './StudentCard';
import {
  PencilIcon,
  SparklesIcon,
  ArrowRightIcon,
  EllipsistIcon
} from './icons';
import { StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Flex,
  Image,
  SimpleGrid,
  Grid,
  GridItem,
  Divider,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Status {
  new: number;
  updated: number;
  perfectOffer: number;
  justDate: number;
}

interface Offer {
  id: number;
  subject: string;
  level: string;
  title: string;
  status: Status;
  offer: string;
  from: string;
  to: string;
  time: string;
  name: string;
  imageURL: string;
}

function Updated() {
  return (
    <Text
      as="p"
      display="inline-flex"
      flexShrink={0}
      alignItems="center"
      rounded="md"
      py="1"
      px="1.5"
      bg="blue.50"
      fontSize="xs"
      mr="2"
      fontWeight="medium"
      color="blue.500"
      className="space-x-1"
    >
      <PencilIcon className="w-4 h-4" onClick={undefined} />
      <Text as="span">Updated</Text>
    </Text>
  );
}

function PerfectOffer() {
  return (
    <Text className="inline-flex flex-shrink-0 mr-2 space-x-1 items-center rounded-md bg-blue-100 px-1.5 py-1 text-xs font-medium text-secondaryBlue">
      <StarIcon w={4} h={4} />
      <span>Perfect Offer</span>
    </Text>
  );
}

function New() {
  return (
    <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      <SparklesIcon className="w-4 h-4" onClick={undefined} />
      <span>New</span>
    </Text>
  );
}

function Date() {
  return (
    <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
      24.09.2022
    </Text>
  );
}

export default function BountyGridList(props) {
  // const { offers, pagination } = props;
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [selectedBid, setSelectedBid] = useState('');
  const { bidId } = useParams();
  const { fetchBountyOffers, bounties, isLoading, pagination } = offerStore();
  const {
    isOpen: isApplyBountyOpen,
    onOpen: openApplyBounty,
    onClose: closeApplyBounty
  } = useDisclosure();
  const handleItemClick = (bounty) => {
    // openApplyBounty();
    // navigate(`/dashboard/tutordashboard/offers/offer/${bounty.id}`);
    setSelectedBid(bounty);
    openApplyBounty();
  };

  useEffect(() => {
    if (bidId && !isLoading) {
      const bounty = bounties.find((obj) => obj.id === bidId);
      navigate(`/dashboard/tutordashboard/bounties`);
      setSelectedBid(bounty);
      openApplyBounty();
    }
    // eslint-disable-next-line
  }, [bidId]);
  useEffect(() => {
    if (selectedBid) {
      openApplyBounty();
    }
  }, [selectedBid]);

  const handlePagination = (nextPage: number) => {
    fetchBountyOffers(nextPage, limit, 'tutor');
  };

  return (
    <>
      {' '}
      <SimpleGrid
        //gap={6}
        columns={3}
        spacingX="15px"
        spacingY="0px"
        //templateColumns="repeat(1, 1fr)"
        //templateColumns={{base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'}}
      >
        {bounties &&
          bounties.map((bounty: any) => (
            <BountyCard
              key={bounty.id}
              id={bounty.id}
              bounty={bounty}
              handleItemClick={handleItemClick}
            />
          ))}
      </SimpleGrid>{' '}
      <Pagination
        page={pagination.page}
        count={pagination.total}
        limit={pagination.limit}
        handlePagination={handlePagination}
      />
      <ApplyBountyModal
        isApplyBountyOpen={isApplyBountyOpen}
        closeApplyBounty={closeApplyBounty}
        bounty={selectedBid}
      />
    </>
  );
}
