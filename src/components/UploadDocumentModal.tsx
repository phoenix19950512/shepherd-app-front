import { UploadIcon } from './icons';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';

interface UploadDocumentModalProps {
  uploadDocumentModal: boolean;
  setUploadDocumentModal: (state: boolean) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  uploadDocumentModal,
  setUploadDocumentModal
}) => {
  return (
    <Transition.Root show={uploadDocumentModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={setUploadDocumentModal}
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
                      onClick={() => setUploadDocumentModal(false)}
                      className="inline-flex flex-shrink-0 space-x-1 items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-secondaryGray"
                    >
                      <span>Close</span>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 px-6 space-y-4 text-center sm:mt-5">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex-shrink-0 bg-white border p-2 rounded-full">
                        <img
                          src="/images/pdf.png"
                          className="h-6 w-6 text-gray-400"
                          alt=""
                        />
                      </div>
                      <div className="flex-shrink-0 bg-white border p-2 rounded-full">
                        <img
                          src="/images/power-point.png"
                          className="h-6 w-6 text-gray-400"
                          alt=""
                        />
                      </div>
                      <div className="flex-shrink-0 bg-white border p-2 rounded-full">
                        <img
                          src="/images/image.png"
                          className="h-6 w-6 text-gray-400"
                          alt=""
                        />
                      </div>
                      <div className="flex-shrink-0 bg-white border p-2 rounded-full">
                        <img
                          src="/images/document.png"
                          className="h-6 w-6 text-gray-400"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm leading-5 text-gray-600">
                        Shepherd supports{' '}
                        <span className="text-secondaryGray font-semibold">
                          .pdf & .jpg
                        </span>{' '}
                        document formats
                      </p>
                    </div>
                    <div className="flex w-full justify-between rounded-md bg-white ring-1 ring-primaryBlue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      <span className="flex items-center space-x-2">
                        <UploadIcon
                          className="text-primaryGray w-5 h-5"
                          onClick={undefined}
                        />
                        <span className="text-dark">Upload doc</span>
                      </span>

                      <div className="flex items-center justify-center">
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 border-4 border-t-4 border-primaryBlue rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 p-3 space-x-4 flex justify-end w-full bg-gray-100 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-md bg-secondaryBlue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    onClick={() => setUploadDocumentModal(false)}
                  >
                    Confirm
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

export default UploadDocumentModal;
