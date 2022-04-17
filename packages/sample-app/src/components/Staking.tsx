import React, { useState } from "react";
import { ethers } from "ethers";

import abis from "../abis/Greeter.json";

const contractAddress = false
  ? "0x764Fc1d4D7128e4e385276057a4E63E69da760fb" // testnet
  : "0xe2800053B600643a4fAb2B5E06c057e9f1270766"; // localhost

export function StakingButton() {
  const [errorMessage, setErrorMessage] = useState("");

  async function exec() {
    const ethereum = (window as any).ethereum;
    if (!ethereum || !ethereum.isMetaMask) {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" }).catch((error) => {
      setErrorMessage(error.message);
    });

    const signer = new ethers.providers.Web3Provider(ethereum).getSigner();
    const contract = new ethers.Contract(contractAddress, abis, signer);
    console.log("contract", contractAddress);

    const result = await contract.exec();
    console.log(result.hash);
  }

  return <button onClick={exec}>staking now!</button>;
}
