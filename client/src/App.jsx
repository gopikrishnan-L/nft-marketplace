import { Box } from "@chakra-ui/react";

import "./App.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import marketplaceJSON from "./contractJson/NFTMarketplace.json";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("Not connected");

  useEffect(() => {
    const template = async () => {
      const contractAddress = marketplaceJSON.address;
      const contractABI = marketplaceJSON.abi;

      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        setAccount(account);
        const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
        const signer = provider.getSigner(); //write the blockchain

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        console.log(contract);
        setState({ provider, signer, contract });
      } catch (error) {
        console.log(error);
      }
    };

    template();
  }, []);

  return (
    <Box
      minH="100%"
      bg="linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%)"
      color="gray.50"
    >
      <Navbar state={state} account={account} />
      <Outlet context={{ state, account }} />
    </Box>
  );
}

export default App;
