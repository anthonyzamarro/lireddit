import { Box, Link } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    });
    let body = null;
    // data is loading
    if (fetching) {
        
    // user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={4}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
            </>
        )

    // user is logged in
    } else {
        body = (
            <Flex>
                <Box mr={4}>{data.me.username}</Box>
                <Button onClick={() => {
                    logout();
                }}
                isLoading={logoutFetching}
                variant="link">logout</Button>
            </Flex>
        )
    }
        return (
            <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4} >
                <Box ml={"auto"}>
                    {body}
                </Box>
            </Flex>
        );
}