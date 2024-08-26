import CustomToast from '../components/CustomComponents/CustomToast';
import ApiService from '../services/ApiService';
import { Box, Text, Textarea, useToast } from '@chakra-ui/react';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

interface DeclineOfferModalProps {
  declineOfferModalState: boolean;
  onClose: () => void;
}

const DeclineOfferModal: React.FC<DeclineOfferModalProps> = ({
  declineOfferModalState,
  onClose
}) => {
  const [comment, setComment] = useState('');

  const handleChangeComment = (event) => {
    setComment(event.target.value);
  };

  const { id } = useParams();
  const toast = useToast();

  const declineOffer = async (id) => {
    // setAcceptingOffer(true);
    const resp = await ApiService.declineOffer(id, comment);
    if (resp.status === 200) {
      toast({
        render: () => (
          <CustomToast title="Offer Declined successfully" status="success" />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
    onClose();
    // setAcceptingOffer(false);
  };
  return (
    <Transition.Root show={declineOfferModalState} as={Fragment}>
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
                <Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    px={2}
                    borderBottom="1px"
                    pb={4}
                  >
                    <Text fontSize="md" fontWeight="medium">
                      Decline Offer
                    </Text>
                  </Box>
                  <Box px={10} mt={2}>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Add a note (optional)
                    </label>
                    <Box mt={2}>
                      <Textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        placeholder="Let the client knows what your terms are"
                        variant="outline"
                        borderColor="gray.200"
                        color="gray.900"
                        shadow="sm"
                        focusBorderColor="red.600"
                        _placeholder={{ color: 'gray.400' }}
                        size="sm"
                        value={comment}
                        onChange={handleChangeComment}
                      />
                    </Box>
                  </Box>
                </Box>
                <div className="mt-5 p-3 flex justify-end w-full bg-gray-100 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-fit justify-center rounded-md bg-error px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    onClick={() => declineOffer(id)}
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

export default DeclineOfferModal;
