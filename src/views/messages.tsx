import { Layout } from '../components';
import { AllMessagesTab } from '../components';
import { classNames } from '../helpers';
import { Text } from '@chakra-ui/react';
import { Tab, Transition, Menu, Dialog, Popover } from '@headlessui/react';
import {
  DocumentIcon,
  EllipsisVerticalIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import React, { Fragment, useState } from 'react';

export default function Messages() {
  const [offerModalState, setOfferModalState] = useState(false);

  return (
    <Layout className="">
      <section className="divide-y max-w-screen-xl mx-auto pb-6 lg:pb-16">
        <main className="relative">
          <div className="bg-white  overflow-hidden">
            <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
              <Tab.Group as="div" className="py-2 lg:col-span-4">
                <nav className="space-y-1">
                  <div className="top px-2">
                    <div className="space-x-2 mb-4">
                      <span>Messages</span>
                    </div>
                    <div className="mt-1 relative py-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="focus:ring-gray-500 outline-none focus:border-gray-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Search"
                      />
                    </div>
                    <div>
                      <div className="block">
                        <Tab.List
                          className="flex bg-gray-100 p-1 rounded-md w-full space-x-4"
                          aria-label="Tabs"
                        >
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <span
                                className={classNames(
                                  selected
                                    ? 'bg-white text-secondaryGray'
                                    : 'text-gray-500 hover:text-gray-700',
                                  'rounded-md cursor-pointer w-full text-center px-3 py-2 hover:bg-white text-sm font-medium'
                                )}
                              >
                                All
                              </span>
                            )}
                          </Tab>
                          <Tab as={Fragment}>
                            {({ selected }) => (
                              <span
                                className={classNames(
                                  selected
                                    ? 'bg-white text-secondaryGray'
                                    : 'text-gray-500 hover:text-gray-700',
                                  'rounded-md cursor-pointer w-full text-center px-3 py-2 hover:bg-white text-sm font-medium'
                                )}
                              >
                                Unread
                              </span>
                            )}
                          </Tab>
                        </Tab.List>
                      </div>
                    </div>
                  </div>

                  <Tab.Panels>
                    <Tab.Panel
                      as="ul"
                      className="divide-y overflow-auto h-screen divide-gray-200"
                    >
                      <AllMessagesTab />
                      <AllMessagesTab />
                      <AllMessagesTab />
                      <AllMessagesTab />
                      <AllMessagesTab />
                      <AllMessagesTab />
                      <AllMessagesTab />
                    </Tab.Panel>
                  </Tab.Panels>
                </nav>
              </Tab.Group>

              <form className="lg:col-span-8 flex-auto h-full">
                <header className="md:w-[51.8%] w-full shadow-sm fixed z-50 bg-white sm:top-16 top-0 right-0">
                  <div className="flex items-center sm:flex-row flex-col py-2 shadow-sm  space-y-4 px-2 justify-between">
                    <div className="flex">
                      <article className=" px-2 cursor-pointer border-top">
                        <div className="flex space-x-3">
                          <span className="inline-block h-fit relative">
                            <div className="h-10 w-10 bg-success text-white flex justify-center items-center rounded-full">
                              L
                            </div>
                          </span>
                          <div className="flex-1 space-y-1">
                            <div className="flex space-x-2">
                              <Text className="text-sm font-medium">
                                <span className="block">
                                  Leslie Peters Mapu
                                </span>
                                <span className="block text-gray-500">
                                  lesliepeters214@gmail.com
                                </span>
                              </Text>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>

                    <div className="flex items-center space-x-2 sm:flex-row sm:flex-wrap">
                      <button
                        type="button"
                        className="inline-flex space-x-3 items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md text-secondaryGray bg-light hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        View Profile
                      </button>

                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button>
                            <EllipsisVerticalIcon className="h-6 text-secondaryGray" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute space-y-3 p-2 right-0 z-50 mt-2.5 w-[14rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                            <Popover className="space-y-2 border-b pb-2">
                              <Popover.Button
                                type="button"
                                className="w-full bg-gray-100 rounded-md flex items-center justify-between p-2"
                              >
                                <div className=" flex items-center space-x-1">
                                  <div className="bg-white flex justify-center items-center w-8 h-8 border rounded-full">
                                    <DocumentIcon className="w-4 h-4 text-secondaryGray" />
                                  </div>
                                  <Text className="text-sm text-secondaryGray font-medium">
                                    Files
                                  </Text>
                                </div>
                                <ChevronRightIcon className="w-2.5 h-2.5" />
                              </Popover.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute -left-[8.5rem] -top-2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
                                  <div className="w-64 shrink rounded-lg bg-white text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                                    <button
                                      type="button"
                                      className="w-full hover:bg-gray-100 flex items-center justify-between p-2"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                          <img
                                            src="/svgs/pdf.svg"
                                            alt="Delete Clients"
                                            className="w-4 h-4"
                                          />
                                        </div>
                                        <Text className="text-sm text-dark font-medium">
                                          Meetingdoc
                                        </Text>
                                      </div>
                                    </button>
                                    <button
                                      type="button"
                                      className="w-full hover:bg-gray-100 flex items-center justify-between p-2"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                          <img
                                            src="/svgs/pdf.svg"
                                            alt="Delete Clients"
                                            className="w-4 h-4"
                                          />
                                        </div>
                                        <Text className="text-sm text-dark font-medium">
                                          Meetingdoc
                                        </Text>
                                      </div>
                                    </button>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </Popover>
                            <button
                              type="button"
                              onClick={() => setOfferModalState(true)}
                              className="w-full hover:bg-gray-100 rounded-md flex items-center justify-between p-2"
                            >
                              <div className="flex items-center space-x-1">
                                <div className="bg-white border flex justify-center items-center w-7 h-7 rounded-full">
                                  <img
                                    src="/svgs/trash.svg"
                                    alt="Delete Clients"
                                    className="w-4 h-4"
                                  />
                                </div>
                                <Text className="text-sm text-error font-medium">
                                  Delete Chat
                                </Text>
                              </div>
                            </button>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </header>

                <div className="flex flex-col flex-auto h-full">
                  <div className="flex overflow-scroll flex-col flex-auto flex-shrink-0 bg-gray-100 h-full">
                    <div className="flex flex-col h-full overflow-x-auto mb-4 mt-20">
                      <div className="flex flex-col h-full">
                        <div className="grid grid-cols-12 gap-y-2">
                          <div className="col-start-1 col-end-10 p-3 rounded-lg">
                            <div className="flex flex-row items-start">
                              <div className="flex items-center text-white justify-center h-7 w-7 rounded-full bg-success flex-shrink-0">
                                L
                              </div>
                              <div className="relative ml-3 text-sm text-secondaryGray bg-white py-2 px-4 shadow rounded-xl">
                                <p>
                                  Nulla ut ut ipsum praesent nulla sem eget.
                                  Aliquam vitae amet magna neque leo. Fames
                                  donec nullam dictum aliquet. Nunc odio lorem
                                  venenatis urna
                                </p>
                              </div>
                            </div>
                            <span className="text-xs pl-10 text-secondaryGray">
                              03:05 PM
                            </span>
                          </div>

                          <div className="col-start-5 col-end-13 p-3 rounded-lg">
                            <div className="flex items-start justify-start flex-row-reverse">
                              <div className="flex items-center justify-center h-7 w-7 rounded-full bg-orange-600 text-white flex-shrink-0">
                                L
                              </div>
                              <div className="relative mr-3 text-sm bg-primaryBlue text-white py-2 px-4 shadow rounded-xl">
                                <p>
                                  Nulla ut ut ipsum praesent nulla sem eget.
                                  Aliquam vitae amet magna neque leo. Fames
                                  donec nullam dictum aliquet.{' '}
                                </p>
                                <button className="w-full bg-white mt-1 rounded-md flex items-center justify-between px-2 py-1">
                                  <div className=" flex items-center space-x-1">
                                    <div className="bg-white flex justify-center items-center w-8 h-8 border rounded-full">
                                      <img
                                        src="/svgs/pdf.svg"
                                        alt="Download the document sent to you"
                                        className="w-4 h-4 text-secondaryGray"
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Document title.pdf
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="text-secondaryGray w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <span className="text-xs text-secondaryGray">
                              03:05 PM
                            </span>
                          </div>

                          <div className="col-start-1 col-end-10 p-3 rounded-lg">
                            <div className="flex flex-row items-start">
                              <div className="flex items-center text-white justify-center h-7 w-7 rounded-full bg-success flex-shrink-0">
                                L
                              </div>
                              <div className="relative ml-3 text-sm text-secondaryGray bg-white py-2 px-4 shadow rounded-xl">
                                <Text>
                                  Nulla ut ut ipsum praesent nulla sem eget.
                                  Aliquam vitae amet magna neque leo. Fames
                                  donec nullam dictum aliquet. Nunc odio lorem
                                  venenatis urna
                                </Text>
                              </div>
                            </div>
                            <span className="text-xs pl-10 text-secondaryGray">
                              03:05 PM
                            </span>
                          </div>

                          <div className="col-start-1 col-end-10 p-3 rounded-lg">
                            <div className="flex flex-row items-start">
                              <div className="flex items-center text-white justify-center h-7 w-7 rounded-full bg-success flex-shrink-0">
                                L
                              </div>
                              <div className="relative ml-3 text-sm text-secondaryGray bg-white py-2 px-4 shadow rounded-xl">
                                <Text>
                                  Nulla ut ut ipsum praesent nulla sem eget.
                                  Aliqua
                                </Text>
                              </div>
                            </div>
                            <span className="text-xs pl-10 text-secondaryGray">
                              03:05 PM
                            </span>
                          </div>

                          <div className="col-start-1 col-end-10 p-3 rounded-lg">
                            <div className="flex flex-row items-start">
                              <div className="flex items-center text-white justify-center h-7 w-7 rounded-full bg-success flex-shrink-0">
                                L
                              </div>
                              <div className="relative ml-3 text-sm text-secondaryGray bg-white py-2 px-4 shadow rounded-xl">
                                <Text>
                                  Nulla ut ut ipsum praesent nulla sem eget.
                                  Aliquam vitae amet magna neque leo. Fames
                                  donec nullam dictum aliquet. Nunc odio lorem
                                  venenatis urna
                                </Text>
                                <button className="w-full bg-gray-100 mt-1 rounded-md flex items-center justify-between px-2 py-1">
                                  <div className=" flex items-center space-x-1">
                                    <div className="bg-white flex justify-center items-center w-8 h-8 border rounded-full">
                                      <img
                                        src="/svgs/pdf.svg"
                                        alt="Download the document sent to you"
                                        className="w-4 h-4 text-secondaryGray"
                                      />
                                    </div>
                                    <Text className="text-sm text-secondaryGray font-medium">
                                      Document title.pdf
                                    </Text>
                                  </div>
                                  <ChevronRightIcon className="text-secondaryGray w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                            <span className="text-xs pl-10 text-secondaryGray">
                              03:05 PM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-[51.8%] w-full shadow-sm fixed z-50 border-t bg-white bottom-0 right-0 flex flex-row items-center h-16 px-4">
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Message Leslie Peters"
                        className="flex w-full bg-gray-100 border-0 rounded-md focus:outline-none pl-4 h-10"
                      />
                      <button className="absolute flex items-center justify-center h-full w-12 right-6 top-0 text-gray-400 hover:text-gray-600">
                        <img alt="" src="/svgs/photo.svg" className="w-4 h-4" />
                      </button>
                      <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                        <DocumentIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button className="flex items-center justify-center bg-primaryBlue hover:bg-blue-400 rounded-md text-white px-4 py-2 flex-shrink-0">
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </section>
      {/* Accept Offer Modal */}
      <Transition.Root show={offerModalState} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOfferModalState}>
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-sm">
                  <div>
                    <div className="flex justify-end px-2">
                      <button
                        onClick={() => setOfferModalState(false)}
                        className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray"
                      >
                        <span>Close</span>
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-12 w-12 mt-4 mx-auto flex items-center justify-center bg-white border shadow-sm p-2 rounded-full">
                      <img
                        src="/svgs/exclamation.svg"
                        className="h-6 w-6"
                        alt=""
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete chat with leslie?
                      </Dialog.Title>
                      <div className="mt-2">
                        <Text className="text-sm text-gray-500">
                          This will clear all conversations and remove Leslie
                          from your message list
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-x-6 p-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md border bg-white px-3 py-2 text-sm font-semibold text-secondaryGray shadow-sm hover:bg--500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setOfferModalState(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={() => setOfferModalState(false)}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Layout>
  );
}
