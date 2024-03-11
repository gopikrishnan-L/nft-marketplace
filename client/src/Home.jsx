import { Box, Flex, Heading } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "./services/pinata";
import NFTTile from "./NFTTile";
import marketplaceJSON from "./contractJson/NFTMarketplace.json";

export default function Home() {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  // const { state, account } = useOutletContext();

  useEffect(() => {
    async function listAllNFTs() {
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        marketplaceJSON.address,
        marketplaceJSON.abi,
        signer
      );
      console.log(contract);
      //create an NFT Token
      let transaction = await contract.getAllNFTs();

      //Fetch all the details of every NFT from the contract and display
      const items = await Promise.all(
        transaction.map(async (i) => {
          var tokenURI = await contract.tokenURI(i.tokenId);
          console.log("getting this tokenUri", tokenURI);
          tokenURI = GetIpfsUrlFromPinata(tokenURI);
          let meta = await axios.get(tokenURI);
          meta = meta.data;
          console.log(meta);

          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
          console.log(item);
          return item;
        })
      );

      console.log(items);
      console.log("Hi");
      setDataFetched(true);
      setData(items);
      console.log(data, dataFetched);
    }
    console.log("running useefffect");
    if (!dataFetched) listAllNFTs();
  }, [data, dataFetched]);
  if (data !== null) {
    return (
      <Box py={6} px={10}>
        <Flex gap={8} wrap="wrap">
          {data?.map((value, index) => (
            // <div>hi</div>
            <NFTTile data={value} key={index} />
          ))}
        </Flex>
      </Box>
    );
  } else
    return (
      <Box py={6} px={10}>
        <Heading size="md">Waiting for NFTs</Heading>
      </Box>
    );
}
