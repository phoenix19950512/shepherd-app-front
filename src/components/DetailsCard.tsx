import { Text } from '@chakra-ui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface OfferDetailsProps {
  name: string;
  avatarSrc: string;
  paymentAwareness: string;
  offerExpires: string;
  subjectLevel: string;
  availability: string;
  note: string;
  hourlyRate: string;
  serviceFee: string;
  finalRate: string;
  totalAmount: string;
  paymentNote: string;
}

const OfferDetails: React.FC<OfferDetailsProps> = ({
  name,
  avatarSrc,
  paymentAwareness,
  offerExpires,
  subjectLevel,
  availability,
  note,
  hourlyRate,
  serviceFee,
  finalRate,
  totalAmount,
  paymentNote
}) => {
  return (
    <div className="-mx-4 space-y-4 sm:mx-0 lg:col-span-2 lg:row-span-2 lg:row-end-2">
      <div className="flex shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3 items-center justify-between">
        <section className="flex items-center sm:space-y-0 space-y-3 sm:space-x-4">
          <img
            className="h-10 w-10 rounded-full bg-gray-50"
            src={avatarSrc}
            alt=""
          />
          <Text className="">
            <span className="block whitespace-nowrap">{name}</span>
            <span className="inline-block text-gray-400 text-sm">
              Offer expires {offerExpires}
            </span>
          </Text>
        </section>
        <div className="flex flex-none items-center gap-x-4">
          <Text className="rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 sm:block">
            {offerExpires}
          </Text>
        </div>
      </div>

      <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
        <Text className="text-xl mb-4 font-semibold tracking-wider">
          Offer Details
        </Text>
        <ul className="space-y-4">
          <li className="text-sm space-y-2 font-normal">
            <Text className="text-secondaryGray">Subject & Level</Text>
            <Text>{subjectLevel}</Text>
          </li>
          <li className="text-sm space-y-2 font-normal">
            <Text className="text-secondaryGray">Availability</Text>
            <Text>{availability}</Text>
          </li>
          <li className="text-sm space-y-2 font-normal">
            <Text className="text-secondaryGray">Note</Text>
            <Text>{note}</Text>
          </li>
        </ul>
      </div>

      <div className="shadow-sm sm:rounded-lg p-4 ring-1 ring-gray-900/5 lg:space-y-0 space-y-3">
        <Text className="text-xl mb-4 font-semibold tracking-wider">
          Payment Details
        </Text>
        <ul className="space-y-4">
          <li className="text-sm space-y-2 font-normal">
            <Text className="text-secondaryGray">Hourly rate</Text>
            <Text className="text-gray-800">{hourlyRate}</Text>
            <Text className="flex space-x-1 text-sm">
              <span>Shepherd charges a</span>
              <span className="text-secondaryBlue">{serviceFee}</span>
              <QuestionMarkCircleIcon className="h-4 w-4 rounded-full text-gray-200 bg-secondaryGray" />
            </Text>
          </li>

          <li className="text-sm space-y-2 font-normal">
            <Text className="text-secondaryGray">You'll receive</Text>
            <Text className="text-gray-800">{finalRate}</Text>
          </li>

          <li className="text-sm mb-4 space-y-2 font-normal">
            <Text className="text-secondaryGray">Total amount</Text>
            <Text className="text-gray-800">{totalAmount}</Text>
            <Text className="flex space-x-1 text-sm">{paymentAwareness}</Text>
          </li>
        </ul>

        <div
          style={{ marginTop: '1rem' }}
          className="flex items-start space-x-2 font-semibold bg-blue-100 text-gray-500 p-3 rounded-md"
        >
          <div className="flex justify-center items-center text-sm font-bold bg-primaryColor text-white w-10 rounded-full">
            i
          </div>
          <Text className="text-sm">{paymentNote}</Text>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
