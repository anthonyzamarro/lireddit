import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorsMap';
import NextLink from 'next/link';

const ChangePassword: NextPage = ({}) => {
    const router = useRouter();
    const [tokenError, setTokenError] = useState('');

    const [,changePassword] = useChangePasswordMutation()
    return ( 
        <Wrapper variant="small">
            <Formik initialValues={{ newPassword: '' }} 
                onSubmit={async (values, {setErrors}) => {
                    const response = await changePassword({
                        newPassword: values.newPassword,
                        token: typeof router.query.token === 'string' ? router.query.token : "",
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        // worked
                        router.push("/");
                    }
            }}>
                {({isSubmitting}) => (
                    <Form>
                        <InputField 
                            name="newPassword" 
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError ? 
                        <Flex>
                            <Box mr={2} color="red">{tokenError}</Box>
                            <NextLink href="/forgot-password">
                                <Link>Click here to get new token</Link>
                            </NextLink>
                        </Flex>
                             : null}
                        <Button 
                            type="submit" 
                            colorScheme="teal" 
                            mt={4} 
                            isLoading={isSubmitting}>
                                change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ChangePassword);
