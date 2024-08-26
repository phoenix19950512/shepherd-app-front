import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import { firebaseAuth, sendPasswordResetEmail } from '../firebase';
import { useTitle } from '../hooks';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';

const Root = styled(Box)``;

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('A valid email address is required')
});

const ForgotPassword: React.FC = () => {
  useTitle('Forgot password');
  const toast = useCustomToast();
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  return (
    <Root>
      {emailSent ? (
        <>
          <Box>
            <svg
              style={{ margin: '0 auto', marginBottom: '32px' }}
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="64" height="64" fill="url(#pattern0)" />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlinkHref="#image0_154_12926"
                    transform="scale(0.00195312)"
                  />
                </pattern>
                <image
                  id="image0_154_12926"
                  width="512"
                  height="512"
                  xlinkHref="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </Box>
          <Box mb={'20px'}>
            <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
              Check your Mail
            </Heading>
            <Text m={0} className="body2" textAlign={'center'}>
              We've sent a link to create a new password to {email}. If it's not
              in your inbox, check your spam/junk folder.
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Box mb={'20px'}>
            <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
              Forgot Password
            </Heading>
            <Text m={0} className="body2" textAlign={'center'}>
              Enter the email you registered with, we will send you a link to
              create a new password
            </Text>
          </Box>
          <Box>
            <Formik
              initialValues={{ email: '' }}
              validationSchema={ForgotPasswordSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setEmail(values.email);
                try {
                  await sendPasswordResetEmail(firebaseAuth, values.email);
                  setEmailSent(true);
                } catch (e: any) {
                  let errorMessage = '';
                  switch (e.code) {
                    case 'auth/user-not-found':
                      errorMessage =
                        "We couldn't find a user with this email address";
                      break;
                    default:
                      errorMessage = 'An unexpected error occurred';
                      break;
                  }

                  toast({
                    title: errorMessage,
                    position: 'top-right',
                    status: 'error',
                    isClosable: true
                  });
                }
                setSubmitting(false);
              }}
            >
              {({ errors, isSubmitting, values }) => (
                <Form>
                  <Field name="email">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel>Email</FormLabel>
                        <Input
                          fontSize="0.875rem"
                          fontFamily="Inter"
                          fontWeight="400"
                          size={'lg'}
                          isInvalid={form.errors.email && form.touched.email}
                          {...field}
                          placeholder="Enter your email"
                        />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Box
                    marginTop={'36px'}
                    display={'flex'}
                    flexDirection="column"
                    gap={4}
                    justifyContent="flex-end"
                  >
                    <Button
                      isDisabled={Object.values(errors).length !== 0}
                      width={'100%'}
                      size="lg"
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Confirm
                    </Button>
                    <Link
                      color="primary.400"
                      className="body2 text-center"
                      as={RouterLink}
                      to="/login"
                    >
                      <span className="body2">Remember your password?</span>{' '}
                      Login
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </>
      )}
    </Root>
  );
};

export default ForgotPassword;
