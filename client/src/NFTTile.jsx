import {
  Box,
  Button,
  Container,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { GetIpfsUrlFromPinata } from "./services/pinata";
import { ethers } from "ethers";
import { useState } from "react";
import marketplaceJSON from "./contractJson/NFTMarketplace.json";
import { TiShoppingCart } from "react-icons/ti";

export default function NFTTile(props) {
  const [address, updateAddress] = useState("0x");
  const [addressFetched, updateAddressFetched] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const IPFSUrl = GetIpfsUrlFromPinata(props.data.image);

  async function getAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
    updateAddressFetched(true);
  }

  async function buyNFT(tokenId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        marketplaceJSON.address,
        marketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(props.data.price, "ether");

      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      onClose();
      window.location.reload();
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  if (!addressFetched) getAddress();

  return (
    <>
      <Container
        p={0}
        w="240px"
        cursor="pointer"
        bg="gray.100"
        // width="fit-content"
        boxShadow="md"
        rounded="lg"
        color="blackAlpha.900"
        transition="transform 0.25s ease-in-out"
        _hover={{
          transform: !props.nonBuyable ? `scale(1.05)` : "",
          "& img": { transform: `scale(1)` },
        }}
        onClick={!props.nonBuyable && onOpen}
      >
        <Image
          roundedTop="lg"
          boxSize="240px"
          src={IPFSUrl}
          alt={props.data.description}
          objectFit="cover"
        />
        <Box
          p={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Text color="blackAlpha.800">Name</Text>
            <Text fontWeight={600} fontSize="lg">
              {props.data.name}
            </Text>
          </Box>
          <Box>
            <Text color="blackAlpha.800">Price</Text>
            <Text fontWeight={600} fontSize="lg">
              {props.data.price}ETH
            </Text>
          </Box>
          {/* <Text>{props.data.description}</Text> */}
        </Box>
      </Container>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Buy NFT - {props.data.name}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={8} justifyContent="space-between">
              <Box>
                <Image
                  roundedTop="lg"
                  boxSize="335px"
                  src={IPFSUrl}
                  alt={props.data.description}
                  objectFit="cover"
                />
              </Box>
              <Box w="70%">
                <Text>Name</Text>
                <Heading size="md">{props.data.name}</Heading>
                <Text>Description</Text>
                <Heading size="md">{props.data.description}</Heading>
                <Text>Token ID</Text>
                <Heading size="md">{props.data.tokenId}</Heading>
                <Text>Seller</Text>
                <Heading size="md">{props.data.seller}</Heading>
                <Flex
                  w="100%"
                  gap={8}
                  justify="space-between"
                  mt={12}
                  // border="1px solid gray"
                >
                  <Flex justify="center" align="center" flexDir="column">
                    <Text fontSize="xl">Price</Text>
                    <Heading size="lg">{props.data.price}ETH</Heading>
                  </Flex>
                  <Flex flexDir="column" w="100%" gap={4}>
                    {address != props.data.owner &&
                    address != props.data.seller ? (
                      <Button
                        colorScheme="messenger"
                        mr={3}
                        onClick={() => buyNFT(props.data.tokenId)}
                        gap={2}
                      >
                        <Icon as={TiShoppingCart} boxSize={6} />
                        Buy NFT
                      </Button>
                    ) : (
                      <Button disabled>You are the owner of this NFT</Button>
                    )}
                    <Button variant="ghost" onClick={onClose}>
                      Close
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
