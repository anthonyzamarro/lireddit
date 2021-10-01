import React from 'react';
import {Formik, Form} from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useLoginMutation} from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorsMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link';

const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    return (
        <Wrapper variant="small">
        <Formik initialValues={{ usernameOrEmail: "", password: ""}} 
            onSubmit={async (values, {setErrors}) => {
                const response = await login(values);
                if (response.data?.login.errors) {
                    setErrors(toErrorMap(response.data.login.errors));
                } else if (response.data?.login.user) {
                    // worked
                    console.log('here');
                    if (typeof router.query.next === 'string') {
                        router.push(router.query.next);
                    } else {
                        router.push("/");
                    }
                }
        }}>
            {({isSubmitting}) => (
                <Form>
                    <InputField 
                        name="usernameOrEmail" 
                        placeholder="username or email"
                        label="Username or Email" />
                    <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password" />
                    </Box>
                    <Flex mt={2}>
                        <NextLink href="/forgot-password">
                            <Link ml="auto">Forgot password?</Link>
                        </NextLink>
                    </Flex>
                    <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>login</Button>
                </Form>
            )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);