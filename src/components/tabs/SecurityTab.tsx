import { Text } from '@chakra-ui/react';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronRightIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useState } from 'react';

export default function SecurityTab() {
  const [deleteAccountModalState, setDeleteAccountModalState] = useState(false);
  const [logoutModalState, setLogoutModalState] = useState(false);
  return (
    <div className="space-y-6">
      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <Text className="border-b pb-4">Account Security</Text>
        <div className="flex pt-2 justify-between items-center">
          <Text className="text-sm">
            <span className="block font-[500] text-dark">Email</span>
            <span className="block text-secondaryGray">leslie@gmail.com</span>
          </Text>
          <button className="bg-white text-secondaryGray text-sm font-semibold border flex justify-center items-center rounded-md px-4 py-1.5">
            Change
          </button>
        </div>
        <div className="flex justify-between items-center">
          <Text className="text-sm">
            <span className="block font-[500] text-dark">Password</span>
            <span className="block text-secondaryGray">*********</span>
          </Text>
          <button className="bg-white text-secondaryGray text-sm font-semibold border flex justify-center items-center rounded-md px-4 py-1.5">
            Change
          </button>
        </div>

        <div
          onClick={() => setLogoutModalState(true)}
          className="cursor-pointer flex justify-between mt-6 items-center"
        >
          <Text className="text-sm">
            <span className="block text-error font-[500]">
              Log out of all devices
            </span>
            <span className="block text-secondaryGray">
              Log out of all other active sessions on other devices besides this
              one.
            </span>
          </Text>
          <ChevronRightIcon className="w-4 text-secondaryGray" />
        </div>
      </section>

      <section className="space-y-4 border shadow-sm sm:rounded-lg p-4">
        <Text className="border-b pb-4">Support</Text>

        <div className="flex justify-between mt-6 items-center">
          <Text className="text-sm">
            <span className="block font-[500] text-dark">
              Terms and Conditions
            </span>
            <span className="block text-secondaryGray">
              Read Sherperd’s terms & conditions
            </span>
          </Text>
          <ChevronRightIcon className="w-4 text-secondaryGray" />
        </div>

        <div className="flex justify-between mt-6 items-center">
          <Text className="text-sm">
            <span className="block font-[500] text-dark">Contact Support</span>
            <span className="block text-secondaryGray">
              Need help? Please reach out to our support team.
            </span>
          </Text>
          <Text>hello@shepherd.study</Text>
        </div>

        <div
          onClick={() => setDeleteAccountModalState(true)}
          className="flex justify-between cursor-pointer mt-6 items-center"
        >
          <Text className="text-sm">
            <span className="block text-error font-[500]">
              Delete my account
            </span>
            <span className="block text-secondaryGray">
              Permanently delete your Shepherd account
            </span>
          </Text>
          <ChevronRightIcon className="w-4 text-secondaryGray" />
        </div>
      </section>

      {/* Logout Modal */}
      <Transition.Root show={logoutModalState} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setLogoutModalState}
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
                        onClick={() => setLogoutModalState(false)}
                        className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray"
                      >
                        <span>Close</span>
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-4 mx-auto flex items-center justify-center">
                      <img
                        src="/svgs/cryemoji.svg"
                        className="h-10 w-10"
                        alt=""
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Logout
                      </Dialog.Title>
                      <div className="mt-2">
                        <Text className="text-sm text-gray-500">
                          Are you sure you want to log out of Sherpherd?
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 p-3 space-x-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-secondaryGray shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setLogoutModalState(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={() => setLogoutModalState(false)}
                    >
                      Log out
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Account Modal */}
      <Transition.Root show={deleteAccountModalState} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setDeleteAccountModalState}
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
                        onClick={() => setDeleteAccountModalState(false)}
                        className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray"
                      >
                        <span>Close</span>
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-4 mx-auto flex items-center justify-center">
                      <img
                        src="/svgs/cryemoji.svg"
                        className="h-10 w-10"
                        alt=""
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete your account
                      </Dialog.Title>
                      <div className="mt-2">
                        <Text className="text-sm text-gray-500">
                          This will permanently delete your Shepherd account
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 p-3 space-x-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-secondaryGray shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setDeleteAccountModalState(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-fit justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                      onClick={() => setDeleteAccountModalState(false)}
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
    </div>
  );
}
