import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { Alert, Close } from "theme-ui";

import abis from "../abis/Greeter.json";
import { TransactionContext } from "../context";

const contractAddress = false
  ? "0xCE7533bB5469114e934463B59EC44dd9f13B5596" // testnet
  : "0xffA143Ed468F6bE2Acc7C2253144166BdC7Ca3Be"; // localhost

export function StakeButton() {
  const { setHash } = useContext(TransactionContext);
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

    try {
      const result = await contract.exec();
      console.log(result.hash);
      setHash(result.hash);
    } catch (error) {
      const message =
        ((error as any).data as any).message ??
        (error as Error).message ??
        "不明なエラーが発生しました";
      if (message.includes("Contract not verified!")) {
        setErrorMessage("このコントラクトは検証されていません。");
      } else if (message.includes("User not verified!")) {
        setErrorMessage("このアドレスは検証されていません。");
      } else if (
        message.includes(
          "MetaMask Tx Signature: User denied transaction signature"
        )
      ) {
        setErrorMessage(""); // pass through
      } else {
        setErrorMessage(message);
      }
    }
  }

  return (
    <>
      <button onClick={exec}>stake now!</button>
      {errorMessage.length > 0 && (
        <Alert
          variant="accent"
          mb={2}
          style={{
            color: "white",
            fontSize: "16px",
            backgroundColor: "red",
            marginTop: "20px",
          }}
        >
          {errorMessage}
          <Close onClick={() => setErrorMessage("")} />
        </Alert>
      )}
    </>
  );
}
