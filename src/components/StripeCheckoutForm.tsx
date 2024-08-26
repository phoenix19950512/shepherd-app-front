import { Alert, AlertIcon, Box, Button } from '@chakra-ui/react';
import {
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import React, { FormEvent, useState } from 'react';
import ShepherdSpinner from '../views/Dashboard/components/shepherd-spinner';

type Props = {
  clientSecret: string;
  returnUrl: string;
};

const StripeCheckoutForm: React.FC<Props> = ({ clientSecret, returnUrl }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setMessage('');

    setIsLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl
      }
    });

    setMessage(error.message || 'An unexpected error occurred.');
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {!stripe || !elements ? (
        <ShepherdSpinner />
      ) : (
        <>
          {!!message && (
            <Box mb={4}>
              <Alert status="error">
                <AlertIcon />
                {message}
              </Alert>
            </Box>
          )}
          <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
          <Box mt={5}>
            <Button
              type="submit"
              width={'100%'}
              variant={'solid'}
              isLoading={isLoading}
              isDisabled={isLoading || !stripe || !elements}
              id="submit"
            >
              Continue
            </Button>
          </Box>
        </>
      )}
    </form>
  );
};

export default StripeCheckoutForm;
