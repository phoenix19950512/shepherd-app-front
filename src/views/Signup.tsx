import CriteriaCheck from '../components/CriteriaCheck';
import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import SecureInput from '../components/SecureInput';
import { createUserWithEmailAndPassword, firebaseAuth } from '../firebase';
import { useTitle } from '../hooks';
import { MinPasswordLength } from '../util';
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
  VStack,
  useToast
} from '@chakra-ui/react';
import { updateProfile } from 'firebase/auth';
import { Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';

const Root = styled(Box)``;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('A valid first name is required'),
  lastName: Yup.string().required('A valid last name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('A valid email address is required'),
  password: Yup.string()
    .required('A password is required')
    .min(
      MinPasswordLength,
      `Your password must be a minimum of ${MinPasswordLength} characters`
    ),
  passwordConfirmation: Yup.string().test(
    'passwords-match',
    'Passwords must match',
    function (value) {
      return this.parent.password === value;
    }
  )
});

const Signup: React.FC = () => {
  useTitle('Sign up');
  const toast = useCustomToast();
  const navigate = useNavigate();
  return (
    <Root>
      <Box mb={'20px'}>
        <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
          Create your Shepherd Account
        </Heading>
        <Text m={0} className="body2" textAlign={'center'}>
          Hi there, before you proceed, let us know who is signing up
        </Text>
      </Box>
      <Box>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: ''
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const user = await createUserWithEmailAndPassword(
                firebaseAuth,
                values.email,
                values.password
              );
              await updateProfile(user.user, {
                displayName: `${values.firstName} ${values.lastName}`
              });
              navigate('/dashboard');
            } catch (e: any) {
              let errorMessage = '';
              switch (e.code) {
                case 'auth/email-already-in-use':
                  errorMessage =
                    'A user with this email address already exists';
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
              <VStack spacing={'22px'}>
                <Field name="firstName">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel>First Name</FormLabel>
                      <Input
                        fontSize="0.875rem"
                        fontFamily="Inter"
                        fontWeight="400"
                        size={'lg'}
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                        {...field}
                        placeholder="Enter your first name"
                      />
                      <FormErrorMessage>
                        {form.errors[field.name] as string}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {({ field, form }: FieldProps) => (
                    <FormControl
                      isInvalid={
                        !!form.errors[field.name] && !!form.touched[field.name]
                      }
                    >
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        fontSize="0.875rem"
                        fontFamily="Inter"
                        fontWeight="400"
                        size={'lg'}
                        isInvalid={
                          !!form.errors[field.name] &&
                          !!form.touched[field.name]
                        }
                        {...field}
                        placeholder="Enter your last name"
                      />
                      <FormErrorMessage>
                        {form.errors[field.name] as string}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
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
                <Field name="password">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                    >
                      <FormLabel>Password</FormLabel>
                      <SecureInput
                        paddingLeft={'16px'}
                        fontSize="0.875rem"
                        fontFamily="Inter"
                        fontWeight="400"
                        size={'lg'}
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                        {...field}
                        placeholder="Enter password"
                      />
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="passwordConfirmation">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl
                      isInvalid={
                        form.errors.passwordConfirmation &&
                        form.touched.passwordConfirmation
                      }
                    >
                      <FormLabel>Confirm Password</FormLabel>
                      <SecureInput
                        fontSize="0.875rem"
                        fontFamily="Inter"
                        fontWeight="400"
                        size={'lg'}
                        isInvalid={
                          form.errors.passwordConfirmation &&
                          form.touched.passwordConfirmation
                        }
                        {...field}
                        placeholder="Re-enter password"
                      />
                      <FormErrorMessage>
                        {form.errors.passwordConfirmation}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </VStack>
              <CriteriaCheck
                mt={17.5}
                text={`${MinPasswordLength} character minimum`}
                checked={values.password.length >= MinPasswordLength}
              />
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
                  Sign Up
                </Button>
                <Link
                  color="primary.400"
                  className="body2 text-center"
                  as={RouterLink}
                  to="/login"
                >
                  <span className="body2">Already have an account?</span> Login
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Root>
  );
};

export default Signup;
