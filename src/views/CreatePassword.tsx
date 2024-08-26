import CriteriaCheck from '../components/CriteriaCheck';
import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import SecureInput from '../components/SecureInput';
import {
  confirmPasswordReset,
  firebaseAuth,
  updatePassword
} from '../firebase';
import { useTitle } from '../hooks';
import { MinPasswordLength } from '../util';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Link,
  Text,
  useToast
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import ApiService from '../services/ApiService';

const Root = styled(Box)``;

const ForgotPasswordSchema = Yup.object().shape({
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

const CreatePassword: React.FC = () => {
  useTitle('Create new password');
  const toast = useCustomToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const oobCode = params.get('oobCode') ?? '';
  const fld: any = params.get('fId');
  const type: any = params.get('type');
  const inviteCode: any = params.get('inviteCode');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const authenticateUser = async () => {
      if (fld && type && inviteCode) {
        try {
          const response: any = await ApiService.ValidateSchoolUsers(
            fld,

            inviteCode
          );
          const { data } = await response.json();

          if (response.status === 200) {
            toast({
              position: 'top-right',
              title: `User Validated Succesfully`,
              status: 'success'
            });
            console.log(data);

            setUser(data);
            return;
          } else {
            // Failed validation, redirect to login page
            navigate('/login');
            // return <CreatePassword {...props} />;
          }
        } catch (error) {
          // Handle API call error
          console.error('Error validating user:', error);
          navigate('/login');
        }
      }
    };

    authenticateUser();
  }, [fld, type, inviteCode, navigate]);
  console.log(user);

  return (
    <Root>
      <Box mb={'20px'}>
        <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
          Create New Password
        </Heading>
        {user && (
          <Box
            mb={4}
            border="1px solid #E2E8F0"
            borderRadius="md"
            p={2}
            shadow="md"
          >
            <Flex gap={4} alignItems="center">
              <Image
                src={
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZK22K6eFm0ynM9TTKPMHw0hECUPHYtgEAgLnFml-0Qg&s'
                }
                alt="School Logo"
                w="70px"
                h="70px"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {user.school.name}
                </Text>
                <Text>
                  User: {user.user.name.first} {user.user.name.last}
                </Text>
              </Box>
            </Flex>
          </Box>
        )}

        <Text m={0} className="body2" textAlign={'center'}>
          Create a strong and secure password for signing in to your account
        </Text>
      </Box>

      <Box>
        <Formik
          initialValues={{ password: '', passwordConfirmation: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={async (values) => {
            setSubmitting(true);
            if (fld && inviteCode) {
              const handleUpdatePassword = async () => {
                try {
                  // Update password with Firebase
                  const response = await ApiService.updateSchoolUserPassword(
                    fld,
                    inviteCode,
                    values.password
                  );
                  if (response.status === 200) {
                    const jsonResp = await response.json();
                    toast({
                      title: 'Password updated successfully',
                      position: 'top-right',
                      status: 'success',
                      isClosable: true
                    });
                    navigate('/login');
                  }
                } catch (error) {
                  // setError(error.message);
                  console.error('Error updating password:', error);
                }
              };
              handleUpdatePassword();
            } else {
              try {
                await confirmPasswordReset(
                  firebaseAuth,
                  oobCode,
                  values.password
                );
                toast({
                  title: 'Password reset successful',
                  position: 'top-right',
                  status: 'success',
                  isClosable: true
                });
                navigate('/login');
              } catch (e: any) {
                let errorMessage = '';
                switch (e.code) {
                  case 'auth/invalid-action-code':
                    errorMessage =
                      'Your password reset link is invalid or expired';
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
            }
          }}
        >
          {({ errors, isSubmitting, values }) => (
            <Form>
              <Field name="password">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    marginTop={'22px'}
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <SecureInput
                      fontSize="0.875rem"
                      fontFamily="Inter"
                      fontWeight="400"
                      size={'lg'}
                      isInvalid={form.errors.password && form.touched.password}
                      {...field}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="passwordConfirmation">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    marginTop={'22px'}
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
                      autoComplete="new-password"
                    />
                    <FormErrorMessage>
                      {form.errors.passwordConfirmation}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
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
                  isLoading={submitting}
                >
                  Confirm
                </Button>
                <Link
                  color="primary.400"
                  className="body2 text-center"
                  as={RouterLink}
                  to="/login"
                >
                  <span className="body2">Remember your old password?</span>{' '}
                  Sign in now
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Root>
  );
};

export default CreatePassword;
