import ApiService from '../services/ApiService';
import { Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

interface OfferSummaryProps {
  setOfferModalState: (state: boolean) => void;
  setDeclineOfferModalState: (state: boolean) => void;
}

const OfferSummary: FC<OfferSummaryProps> = ({
  setOfferModalState,
  setDeclineOfferModalState
}) => {
  const { id } = useParams();
  const acceptOffer = async () => {
    // setAcceptingOffer(true);
    const resp = await ApiService.acceptOffer(id as string);
    // setOffer(await resp.json());
    setOfferModalState(true);
    // setAcceptingOffer(false);
  };
  return (
    <div className="lg:col-start-3 bg-white lg:col-span-2 lg:row-end-1 p-2 rounded-lg shadow-sm ring-1 ring-gray-900/5">
      <div>
        <div className="h-12 w-12 mx-auto flex items-center justify-center bg-gray-100 p-2 rounded-full">
          <img
            src="/svgs/text-document.svg"
            className="h-6 w-6 text-gray-400"
            alt=""
          />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <div className="mt-2">
            <Text className="text-sm text-gray-500">
              Respond to the offer before it expires
            </Text>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          onClick={() => acceptOffer()}
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-primaryBlue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Accept Offer
        </button>
      </div>
      <div className="mt-2 sm:mt-4">
        <button
          onClick={() => setDeclineOfferModalState(true)}
          type="button"
          className="inline-flex w-full justify-center rounded-md bg-error700 px-3 py-2 text-sm font-semibold text-error shadow-sm hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error-600"
        >
          Decline Offer
        </button>
      </div>
    </div>
  );
};

export default OfferSummary;
