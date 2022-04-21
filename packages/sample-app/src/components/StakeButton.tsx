import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import { Alert, Close } from "theme-ui";

import abis from "../abis/Greeter.json";
import { TransactionContext } from "../context";

const contractAddress = {
  local: "0x9592F8aa5Cb40EA44E1f3Fd69d0f27939894d679",
  shibuya: "0x8A97a3d720D94f68429E9a8f2c0572FaF9F143BC",
};

export function StakeButton() {
  const { hash, setHash } = useContext(TransactionContext);
  const [errorMessage, setErrorMessage] = useState("");

  async function exec() {
    const ethereum = (window as any).ethereum;
    if (!ethereum || !ethereum.isMetaMask) {
      console.log("Need to install MetaMask");
      setErrorMessage("MetaMaskをインストールしてください");
      return;
    }

    await ethereum.request({ method: "eth_requestAccounts" }).catch((error) => {
      setErrorMessage(error.message);
    });

    const currentNetwork = (ethereum as any).networkVersion;
    if (!(currentNetwork === "81" || currentNetwork === "4369")) {
      setErrorMessage("ネットワークをShibuyaに変えてください");
      return;
    }

    const signer = new ethers.providers.Web3Provider(ethereum).getSigner();
    const contract = new ethers.Contract(
      currentNetwork === "81" ? contractAddress.shibuya : contractAddress.local,
      abis,
      signer
    );
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
      } else if (message.includes("User not registerd!")) {
        setErrorMessage("このアドレスは登録されていません。");
      } else if (message.includes("User not allowed!")) {
        setErrorMessage("お住まいの国では利用できません。");
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
      {hash.length > 0 && (
        <Alert
          mb={2}
          style={{
            color: "white",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          Txを発行しました!ブロック取り込みまでしばらくお待ちください。 {hash}
          <Close onClick={() => setErrorMessage("")} />
        </Alert>
      )}
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
