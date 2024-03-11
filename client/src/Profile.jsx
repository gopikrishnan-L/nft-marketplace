import { useOutletContext } from "react-router-dom";
import { ethers } from "ethers";
import { Text, Box, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { GetIpfsUrlFromPinata } from "./services/pinata";
import NFTTile from "./NFTTile";

export default function Profile() {
  const { state, account } = useOutletContext();
  const { signer, contract } = state;

  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [totalPrice, updateTotalPrice] = useState("0");
  const [address, updateAddress] = useState("0x");

  async function getNFTData(tokenId) {
    let sumPrice = 0;
    //create an NFT Token
    let transaction = await contract.getMyNFTs();

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */

    const items = await Promise.all(
      transaction.map(async (i) => {
        var tokenURI = await contract.tokenURI(i.tokenId);
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
        sumPrice += Number(price);
        return item;
      })
    );
    const addr = await signer.getAddress();
    updateData(items);
    updateFetched(true);

    updateTotalPrice(sumPrice.toPrecision(3));
    updateAddress(addr);
    console.log(items);
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

  return (
    <Box py={6} px={10}>
      <Heading size="sm">Wallet account address</Heading>
      <Text> {address}</Text>
      {/* <Text> {account}</Text> */}
      <Heading size="sm" mt={4}>
        Number of NFTs
      </Heading>
      <Text>{data.length}</Text>
      <Heading size="sm" mt={4}>
        Total Value
      </Heading>
      <Text>{totalPrice} ETH</Text>
      <Box>
        <Heading size="md" my="2rem">
          Your NFTs
        </Heading>
        <Flex gap={8} wrap="wrap" justify="flex-start">
          {data?.map((value, index) => {
            return (
              <NFTTile data={value} key={index} nonBuyable={true}></NFTTile>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
}
