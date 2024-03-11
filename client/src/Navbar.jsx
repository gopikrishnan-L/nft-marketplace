import { Box, Button, HStack, Heading, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink, Outlet } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";

const navLinks = [
  {
    name: "Home",
    route: "/",
  },
  {
    name: "List NFT",
    route: "/mint",
  },
  {
    name: "Profile",
    route: "/user",
  },
];

export default function Navbar({ account, state }) {
  return (
    <Box
      display="flex"
      color="gray.50"
      justifyContent="space-between"
      py="2"
      px="4"
      alignItems="center"
      //   boxShadow="md"
    >
      <HStack spacing="2rem">
        <Heading as="h5" size="md" borderRight="1px solid gray" px={4}>
          <ChakraLink
            as={ReactRouterLink}
            to="/"
            _hover={{ textDecoration: "none" }}
          >
            NFT Chain
          </ChakraLink>
        </Heading>
        {navLinks.map((navLink) => (
          <Text fontSize="lg" key={navLink.route} fontWeight={600}>
            <ChakraLink
              as={ReactRouterLink}
              to={navLink.route}
              _hover={{ textDecoration: "none", color: "teal.200" }}
            >
              {navLink.name}
            </ChakraLink>
          </Text>
        ))}
      </HStack>
      <HStack w="fit-content" gap={4}>
        <Text>{account.toString().slice(0, 10) + "..."}</Text>
        {/* <Button colorScheme="whatsapp">Connect</Button> */}
        <Button colorScheme="whatsapp">
          {account ? <>Connected</> : <>Connect</>}
        </Button>
      </HStack>
    </Box>
  );
}
