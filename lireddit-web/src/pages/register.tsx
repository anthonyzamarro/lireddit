import React from 'react';
import {Formik, Form} from 'formik';
import { Box, Button } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorsMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
        <Formik initialValues={{email: "", username: "", password: ""}} 
            onSubmit={async (values, {setErrors}) => {
                const response = await register({options: values});
                if (response.data?.register.errors) {
                    setErrors(toErrorMap(response.data.register.errors));
                } else if (response.data?.register.user) {
                    // worked
                    console.log('here');
                    router.push("/");
                }
        }}>
            {({isSubmitting}) => (
                <Form>
                    <InputField name="username" placeholder="username" label="Username" />
                    <Box mt={4}>
                        <InputField name="email" placeholder="email" label="Email" type="email" />
                    </Box>
                    <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password" />
                    </Box>
                    <Button type="submit" colorScheme="teal" mt={4} isLoading={isSubmitting}>register</Button>
                </Form>
            )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);