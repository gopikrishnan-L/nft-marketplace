import {
  Box,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";

import { uploadFileToIPFS, uploadJSONToIPFS } from "./services/pinata";
// import marketplaceJSON from "./contractJson/NFTMarketplace.json";

export default function MintNFT() {
  const { state } = useOutletContext();
  const { provider, signer, contract } = state;

  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  // const [imageUrl, setImageUrl] = useState(null);
  // const [metadataUrl, setMetadataUrl] = useState(null);

  async function OnChangeFile(e) {
    console.log("inside onchange file");
    const file = e.target.files[0];
    console.log(file);
    setImage(file);
  }

  async function onSubmit() {
    const { name, description, price } = formParams;
    console.log(name, description, price, image);
    try {
      const response1 = await uploadFileToIPFS(image);
      const imageUrl = response1.pinataURL;
      console.log(name, description, price, imageUrl);
      if (!name || !description || !price || !imageUrl) {
        console.log("fill all the fields");
        return -1;
      }

      const nftJSON = {
        name,
        description,
        price,
        image: imageUrl,
      };

      const response = await uploadJSONToIPFS(nftJSON);
      let metadataUrl = "";
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        metadataUrl = response.pinataURL;
      }

      const NFTprice = ethers.utils.parseUnits(price, "ether");

      let listingPrice = await contract.getListPrice();
      listingPrice = await listingPrice.toString();

      let transaction = await contract.createToken(metadataUrl, NFTprice, {
        value: listingPrice,
      });
      await transaction.wait();

      updateFormParams({ name: "", description: "", price: "" });
      window.location.replace("/");
      console.log("uploaded");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      py={3}
      px={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="90vh"
      color="blackAlpha.900"
    >
      <VStack
        bg="white"
        boxShadow="md"
        py={6}
        px={10}
        gap={6}
        roundedLeft="lg"
        roundedRight="lg"
        w="400px"
        h="550px"
      >
        <Heading size="lg" mb={4}>
          List NFT for Sale
        </Heading>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={formParams.name}
            onChange={(e) =>
              updateFormParams({ ...formParams, name: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={formParams.description}
            onChange={(e) =>
              updateFormParams({ ...formParams, description: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            value={formParams.price}
            onChange={(e) =>
              updateFormParams({ ...formParams, price: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <Input
            type="file"
            onChange={OnChangeFile}
            sx={{
              "::file-selector-button": {
                height: 10,
                padding: 0,
                mr: 4,
                background: "none",
                border: "none",
                fontWeight: "bold",
              },
            }}
          />
        </FormControl>
        <Button
          w="100%"
          colorScheme="blue"
          onClick={(e) => {
            e.stopPropagation();
            onSubmit();
          }}
        >
          List NFT
        </Button>
      </VStack>
      {/* <VStack
        bg="white"
        boxShadow="md"
        py={6}
        px={10}
        gap={6}
        roundedLeft="lg"
        roundedRight="lg"
        w="400px"
        h="550px"
      ></VStack> */}
    </Box>
  );
}
