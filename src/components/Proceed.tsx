import {
  Avatar,
  CircularProgress,
  Text,
  Box,
  HStack,
  Image,
  Button,
  Input
} from '@chakra-ui/react';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, FC, useRef, memo, useState } from 'react';
import { useNavigate } from 'react-router';
interface ProceedPageProps {
  user: any;
}

const Proceed: FC<ProceedPageProps> = ({ user }) => {
  // const { user } = props;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <Box px={6} mt={4}>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          px={4}
          rounded="md"
          py="3"
          shadow="sm"
          border="2px"
          borderColor="gray.100"
        >
          <HStack
            pos="relative"
            display="flex"
            spacing={4}
            flexWrap="wrap"
            alignItems="center"
          >
            {/* <Image
              pos="absolute"
              top={['2', '-3', '-2']}
              left={['2', '4', '12']}
              transform={['rotate(38deg)', 'rotate(16deg)', 'rotate(-16deg)']}
              alt=""
              src="/svgs/cut-border.svg"
            />
            <Avatar
              boxSize="64px"
              color="white"
              name={`${user?.name.first} ${user?.name.last}`}
              bg="#4CAF50;"
            /> */}
            <div style={{ position: 'relative' }}>
              <Avatar
                color="white"
                name={`${user?.name.first} ${user?.name.last}`}
                bg="#4CAF50"
                size="lg"
              />
              <CircularProgress
                value={30}
                size="88px"
                color={'#207DF7'}
                trackColor="transparent"
                thickness="4px"
                position="absolute"
                capIsRound={true}
                top={-3}
                left={-3}
                zIndex="1"
              />
            </div>

            <Text my={4} as="p">
              <Text
                as="span"
                display="block"
                whiteSpace="nowrap"
                fontSize={15}
                fontWeight="500"
                color="text.200"
              >
                Welcome to shepherd
              </Text>
              {/* <Text
                as="span"
                display="inline-block"
                fontSize={14}
                color="text.300"
              >
                We need a few more details to complete your profile. This helps
                you stand out from other tutors.
              </Text> */}
              <Text>Update your availability to complete your profile</Text>
            </Text>
          </HStack>
          <HStack mt={[4, 4, 0]} display="flex" alignItems="center" spacing={4}>
            <Button
              rounded="md"
              bg="gray.100"
              px="2.5"
              py="1.5"
              fontWeight="500"
              color="#5C5F64"
              shadow="sm"
              _hover={{ bg: 'gray.50' }}
              onClick={() => navigate('account-settings')}
            >
              Proceed
            </Button>
          </HStack>
        </Box>
      </Box>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-1 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-10">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                  <Text className="border-b px-2 py-4 text-center">
                    {`Hey ${user?.name.first} ${user?.name.last}, could you please provide a summary of the lesson?`}
                  </Text>
                  <form className="space-y-6 p-6" action="#" method="POST">
                    <div className="flex items-start space-x-2 font-semibold bg-blue-50 text-gray-400 p-2 rounded-md">
                      <div className="flex justify-center items-center font-bold bg-primaryColor text-white w-12 h-8 rounded-full">
                        <span>i</span>
                      </div>
                      <Text as="p" fontSize="xs" color="gray.500">
                        submitting a summary of each lesson with your students
                        is neccessary for payment processing.
                      </Text>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium leading-6 text-gray-500"
                      >
                        Subject
                      </label>
                      <div className="mt-2">
                        <Input
                          id="subject"
                          name="subject"
                          type="texg"
                          autoComplete="subject"
                          placeholder="Enter subject"
                          required
                          className="block w-full rounded-md p-1.5 shadow-sm border ring-0 border-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="topic"
                        className="block text-sm font-medium leading-6 text-gray-500"
                      >
                        Topic
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="topic"
                          name="topic"
                          autoComplete="topic"
                          placeholder="Topic"
                          required
                          className="block w-full rounded-md p-1.5 shadow-sm border border-gray-200 placeholder:text-gray-400 focus:ring-0 focus:border-none sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="summary"
                        className="block text-sm font-medium leading-6 text-gray-500"
                      >
                        Summary
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="summary"
                          name="summary"
                          autoComplete="summary"
                          placeholder="Summary"
                          required
                          className="block w-full rounded-md border p-1.5 shadow-sm ring-0 border-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        onClick={() => setOpen(false)}
                        className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        Confirm
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default memo(Proceed);
