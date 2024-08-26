import {
  Layout,
  ProfileTab,
  SecurityTab,
  PaymentTab,
  NotificationsTab
} from '../../components';
import { classNames } from '../../helpers';
import { Text } from '@chakra-ui/react';
import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react';

export default function Settings() {
  return (
    <Layout className="bg-gray-100 px-4 py-8">
      <Text mb="8" as="h4">
        Account Settings
      </Text>
      <Tab.Group
        as="div"
        className="mx-auto bg-white max-w-7xl lg:flex lg:gap-x-8 lg:px-8 rounded-2xl"
      >
        <aside className="flex overflow-x-auto border-r border-r-gray-200 pr-6 py-8 lg:block lg:w-[13.5rem] lg:flex-none">
          <nav className="flex-none">
            <Tab.List className="flex gap-x-3 w-full gap-y-1 whitespace-nowrap lg:flex-col">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? 'bg-blue-50 text-secondaryBlue'
                        : 'text-primaryGray hover:text-secondaryBlue hover:bg-blue-50',
                      'group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    My Profile
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? 'bg-blue-50 text-secondaryBlue'
                        : 'text-primaryGray hover:text-secondaryBlue hover:bg-blue-50',
                      'group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    Security
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? 'bg-blue-50 text-secondaryBlue'
                        : 'text-primaryGray hover:text-secondaryBlue hover:bg-blue-50',
                      'group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    Notifications
                  </span>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <span
                    className={classNames(
                      selected
                        ? 'bg-blue-50 text-secondaryBlue'
                        : 'text-primaryGray hover:text-secondaryBlue hover:bg-blue-50',
                      'group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    )}
                  >
                    Payment
                  </span>
                )}
              </Tab>
            </Tab.List>
          </nav>
        </aside>

        <main className="px-4 py-8 sm:px-6 lg:flex-auto lg:px-0">
          <Tab.Panels>
            <Tab.Panel>
              <ProfileTab />
            </Tab.Panel>
            <Tab.Panel>
              <SecurityTab />
            </Tab.Panel>
            <Tab.Panel>
              <NotificationsTab />
            </Tab.Panel>
            <Tab.Panel>
              <PaymentTab />
            </Tab.Panel>
          </Tab.Panels>
        </main>
      </Tab.Group>
    </Layout>
  );
}
