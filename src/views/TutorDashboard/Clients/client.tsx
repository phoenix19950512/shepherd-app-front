import ApiService from '../../../services/ApiService';
import { convertTimeToDateTime, convertUtcToUserTime } from '../../../util';
import { Avatar, Text, Box } from '@chakra-ui/react';
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/20/solid';
import moment from 'moment';
import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ShepherdSpinner from '../../Dashboard/components/shepherd-spinner';

export default function Client() {
  const { clientId }: any = useParams();
  const [client, setClient] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const doFetchTutorClient = useCallback(async (id: string) => {
    const response = await ApiService.getTutorSingleClients(id);
    const tutorClients = await response.json();
    setClient(tutorClients);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    doFetchTutorClient(clientId);
  }, [doFetchTutorClient, clientId]);

  const dayMappings = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  };

  function getDaysOfWeek(schedule) {
    const selectedDays = Object.keys(schedule).map((key) => dayMappings[key]);
    const daysOfWeek = selectedDays.join(',');
    return daysOfWeek;
  }

  function formatTimeRange(begin: string, end: string): string {
    return `${begin} -> ${end}`;
  }

  function getFormattedTimeRanges(
    schedule: Record<string, { begin: string; end: string }>
  ): string {
    const formattedTimeRanges = Object.values(schedule).map(
      ({ begin, end }) => {
        return formatTimeRange(
          convertUtcToUserTime(convertTimeToDateTime(begin)),
          convertUtcToUserTime(convertTimeToDateTime(end))
        );
      }
    );
    return formattedTimeRanges.join(', ');
  }

  if (isLoading) {
    return (
      <Box
        p={5}
        textAlign="center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <ShepherdSpinner />
      </Box>
    );
  }

  return (
    <>
      <nav className="flex mt-4" aria-label="Breadcrumb">
        <ol className="flex items-center">
          <li>
            <button className="flex items-center">
              <Link
                to="/dashboard/tutordashboard/clients"
                className="text-sm font-medium text-gray-400 hover:text-gray-700"
              >
                Students
              </Link>
            </button>
          </li>
          <li>
            <div className="flex items-center text-gray-400">
              <ChevronRightIcon
                className="flex-shrink-0 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <Text className="text-sm font-medium">
                {' '}
                {`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}
              </Text>
            </div>
          </li>
          {/* <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <Text className="text-sm font-normal text-secondaryBlue hover:text-blue-700">
                Contract
              </Text>
            </div>
          </li> */}
        </ol>
      </nav>
      <section className="my-4">
        <Text className="space-x-2">
          <span className="px-4 text-2xl font-bold">Contract</span>
        </Text>
      </section>

      <div className="px-4 py-10 mx-auto max-w-7xl sm:px-2">
        <div className="grid items-start max-w-2xl grid-cols-1 grid-rows-1 mx-auto gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Invoice summary */}
          <div className="p-2 bg-white rounded-lg shadow-sm lg:col-start-3 lg:col-span-2 lg:row-end-1 ring-1 ring-gray-900/5">
            <div>
              <div className="flex items-center justify-center p-2 mx-auto bg-gray-100 rounded-full h-14 w-14">
                <img
                  src="/svgs/text-document.svg"
                  className="w-6 h-6 text-gray-400"
                  alt=""
                />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <div className="mt-2 space-y-1">
                  <Text className="font-semibold text-dark">
                    You have an active contract
                  </Text>
                  <Text className="text-sm text-gray-500">
                    You’ve completed 10 out of 15 sessions
                  </Text>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-gray-500 bg-white border rounded-md shadow-sm hover:text-gray-560 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Send message
              </button>
            </div>
          </div>

          <div className="-mx-4 space-y-4 sm:mx-0 lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <div className="flex items-center justify-between p-4 space-y-3 shadow-sm sm:rounded-lg ring-1 ring-gray-900/5 lg:space-y-0">
              <section className="flex items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Avatar
                  name={`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}
                  src={client?.student?.user?.avatar}
                />

                <Text className="">
                  <span className="block whitespace-nowrap">{`${client?.student?.user?.name.first} ${client?.student?.user?.name.last}`}</span>
                  <span className="inline-block text-sm text-gray-400">
                    {`  Your contract with ${
                      client?.student?.user?.name.first
                    } ends ${moment(client?.offer?.contractEndDate).format(
                      'MMMM DD, YYYY'
                    )}`}
                  </span>
                </Text>
              </section>
              <div className="flex items-center flex-none gap-x-4">
                <Text className="rounded-md bg-gray-50 px-2.5 py-1.5 text-sm font-semibold text-gray-500 shadow-sm hover:bg-gray-50 sm:block">
                  {moment(client?.offer?.contractEndDate).format('MM.DD.YYYY')}
                </Text>
              </div>
            </div>

            <div className="p-4 space-y-3 shadow-sm sm:rounded-lg ring-1 ring-gray-900/5 lg:space-y-0">
              <Text className="mb-4 text-xl font-semibold tracking-wider">
                Offer Details
              </Text>
              <ul className="space-y-4">
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Subject & Level</Text>
                  <Text>{`${client?.offer?.course.label} - ${client?.offer?.level.label}`}</Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">
                    What days would you like to have your classes
                  </Text>
                  <Text>{getDaysOfWeek(client?.offer.schedule)}</Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">
                    Frequency of class sessions
                  </Text>
                  <Text>Weekly</Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Time</Text>
                  <Text className="flex items-center space-x-1">
                    {getFormattedTimeRanges(client.offer.schedule)}
                  </Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Start date</Text>
                  <Text>
                    {moment(client?.offer?.contractStartDate).format(
                      'MMMM DD, YYYY'
                    )}
                  </Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">End date</Text>
                  <Text>
                    {moment(client?.offer?.contractEndDate).format(
                      'MMMM DD, YYYY'
                    )}
                  </Text>
                </li>
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Note</Text>
                  <Text>{client.offer.note}</Text>
                </li>
              </ul>
            </div>

            <div className="p-4 space-y-3 shadow-sm sm:rounded-lg ring-1 ring-gray-900/5 lg:space-y-0">
              <Text className="mb-4 text-xl font-semibold tracking-wider">
                Payment Details
              </Text>
              <ul className="space-y-4">
                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Hourly rate</Text>
                  <Text className="text-gray-800">{`$${client.offer.rate}.00/hr`}</Text>
                  <Text className="flex space-x-1 text-sm">
                    <span>Shepherd charges a</span>
                    <span className="text-secondaryBlue">
                      {` 5% service fee (-$${client.offer.rate * 0.05}.00/hr)`}
                    </span>
                    <QuestionMarkCircleIcon className="w-4 h-4 text-gray-200 rounded-full bg-secondaryGray" />
                  </Text>
                </li>

                <li className="space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">You'll receive</Text>
                  <Text className="text-gray-800">{`$${
                    client.offer.rate - client.offer.rate * 0.05
                  }.00/hr`}</Text>
                </li>

                <li className="mb-4 space-y-2 text-sm font-normal">
                  <Text className="text-secondaryGray">Total amount</Text>
                  <Text className="text-gray-800">$000.00</Text>
                  <Text className="flex space-x-1 text-sm">
                    You'll be paid after each session
                  </Text>
                </li>
              </ul>

              <div
                style={{ marginTop: '1rem' }}
                className="flex items-start p-3 space-x-2 font-semibold text-gray-500 bg-blue-100 rounded-md"
              >
                <div className="flex items-center justify-center w-10 text-sm font-bold text-white rounded-full bg-primaryColor">
                  i
                </div>
                <Text className="text-sm">
                  Initial payment will not be made until after the student
                  reviews the offer after the first session. The student may
                  decide to continue with you or withdraw the offer
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
