import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';

interface AcceptOfferModalProps {
  offerModalState: boolean;
  onClose: () => void;
}

const AcceptOfferModal: React.FC<AcceptOfferModalProps> = ({
  offerModalState,
  onClose
}) => {
  return (
    <Transition.Root show={offerModalState} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => onClose()}>
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
                      onClick={() => onClose()}
                      className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray"
                    >
                      <span>Close</span>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-12 w-12 mt-4 mx-auto flex items-center justify-center bg-white border shadow-sm p-2 rounded-full">
                    <img src="/svgs/offer.svg" className="h-6 w-6" alt="" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Offer Accepted
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        William Kelly has been added to your message list
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 p-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-md bg-primaryBlue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    // onClick={onCloseOfferModal}
                  >
                    Send a message
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AcceptOfferModal;
