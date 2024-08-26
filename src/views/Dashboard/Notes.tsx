import React from 'react';
import { AllNotesTab } from '../../components';
import {
  ArrowRightIcon,
  SortIcon,
  FilterByTagsIcon
} from '../../components/icons';
import { classNames } from '../../helpers';
import { Text } from '@chakra-ui/react';
import { Menu, Transition, Tab } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const notes = [{}];

export default function Notes() {
  return (
    <>
      {notes.length > 0 ? (
        <>
          <header className="flex mt-4 justify-between">
            <Text className="flex items-center space-x-2">
              <span className="font-bold text-2xl">My Notes</span>
              <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded-md text-primaryGray">
                24
              </span>
            </Text>
            <div className="flex space-x-4">
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex text-secondaryGray items-center space-x-2 border px-3 py-2 rounded-md">
                    <SortIcon className="w-5 h-5" />
                    <span>Sort by</span>
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
                  <Menu.Items className="absolute space-y-3 p-4 right-0 z-50 mt-2.5 w-[12rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                    <section>
                      <div className="w-full">
                        <Text className="text-sm text-secondaryGray mb-2">
                          By date
                        </Text>
                        <button className="w-full flex bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-sm text-dark font-semibold">
                            Recently created
                          </Text>
                        </button>
                        <button className="w-full flex mt-2 hover:bg-gray-100 rounded-md items-center justify-between p-2">
                          <Text className="text-sm text-dark font-semibold">
                            Last modified
                          </Text>
                        </button>
                      </div>

                      <div className="w-full">
                        <Text className="text-sm text-secondaryGray mt-4 mb-2">
                          By title
                        </Text>
                        <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-xs flex space-x-2 items-center text-dark">
                            <span>A</span>
                            <ArrowRightIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            <span>Z</span>
                          </Text>
                        </button>
                        <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-xs flex space-x-2 items-center text-dark">
                            <span>Z</span>
                            <ArrowRightIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            <span>A</span>
                          </Text>
                        </button>
                      </div>
                    </section>
                  </Menu.Items>
                </Transition>
              </Menu>
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex text-secondaryGray items-center space-x-2 border px-3 py-2 rounded-md">
                    <FilterByTagsIcon className="w-5 h-5" />
                    <span>Filter by tags</span>
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
                  <Menu.Items className="absolute space-y-3 p-4 right-0 z-50 mt-2.5 w-[12rem] origin-top-right rounded-lg bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none">
                    <section>
                      <div className="w-full">
                        <Text className="text-sm text-secondaryGray mb-2">
                          By date
                        </Text>
                        <button className="w-full flex bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-sm text-dark">Start date</Text>
                        </button>
                        <button className="w-full flex mt-2 hover:bg-gray-100 rounded-md items-center justify-between p-2">
                          <Text className="text-sm text-dark">End date</Text>
                        </button>
                      </div>

                      <div className="w-full">
                        <Text className="text-sm text-secondaryGray mt-4 mb-2">
                          By name
                        </Text>
                        <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-xs flex space-x-2 items-center text-dark">
                            <span>A</span>
                            <ArrowRightIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            <span>Z</span>
                          </Text>
                        </button>
                        <button className="w-full flex hover:bg-gray-100 rounded-md  items-center justify-between p-2">
                          <Text className="text-xs flex space-x-2 items-center text-dark">
                            <span>Z</span>
                            <ArrowRightIcon
                              className="w-5"
                              onClick={undefined}
                            />
                            <span>A</span>
                          </Text>
                        </button>
                      </div>
                    </section>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </header>
          <Tab.Group as="div" className="mt-4">
            <div className="mb-4">
              <div className="border-b border-gray-200">
                <Tab.List className="-mb-px flex space-x-8" aria-label="Tabs">
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <span
                        className={classNames(
                          selected
                            ? 'border-primaryBlue text-primaryBlue'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                        )}
                      >
                        All Notes
                      </span>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <span
                        className={classNames(
                          selected
                            ? 'border-primaryBlue text-primaryBlue'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                        )}
                      >
                        Documents
                      </span>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <span
                        className={classNames(
                          selected
                            ? 'border-primaryBlue text-primaryBlue'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'group cursor-pointer border-b-4 py-4 px-1 text-sm font-medium'
                        )}
                      >
                        Notes
                      </span>
                    )}
                  </Tab>
                </Tab.List>
              </div>
            </div>

            <Tab.Panels>
              <Tab.Panel>
                <AllNotesTab
                  data={[]}
                  getNotes={function (): void {
                    throw new Error('Function not implemented.');
                  }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      ) : (
        <>
          <header className="flex mt-4 justify-between">
            <Text className="flex items-center space-x-2">
              <span className="font-bold text-2xl">My Notes</span>
            </Text>
          </header>
          <section className="flex justify-center items-center mt-28 w-full">
            <div className="text-center">
              <img src="/images/notes.png" alt="" />
              <Text>You don't have any notes yet!</Text>
              <button
                type="button"
                className="inline-flex items-center justify-center mt-4 gap-x-2 w-[286px] rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Create new
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
