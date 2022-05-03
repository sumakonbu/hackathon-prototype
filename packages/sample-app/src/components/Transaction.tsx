import React, { useContext, useEffect, useState } from "react";
import { Alert, Progress } from "theme-ui";
import { ethers } from "ethers";

import { TransactionContext } from "../context";

export function Transaction() {
  const { hash, setHash } = useContext(TransactionContext);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (hash.length === 0) {
      return;
    }

    setFinished(false);
    let timerId = 0;
    let counter = 0;
    timerId = window.setInterval(async () => {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        return;
      }

      // Call tx to ethereum
      const provider = new ethers.providers.Web3Provider(ethereum);
      const receipt = await provider.getTransactionReceipt(hash);
      // Block completed if having receipt.
      if (receipt) {
        setFinished(true);
        setHash("");
        clearInterval(timerId);
      }

      counter = counter < 10 ? counter + 1 : 1;
      setProgress(counter);
    }, 1000);
  }, [hash]);

  return (
    <>
      {hash.length > 0 && <Progress max={10} value={progress}></Progress>}
      {finished && (
        <Alert
          style={{
            color: "white",
            marginTop: "20px",
          }}
        >
          🎉🎉🎉🎉🎉　You Are Great! 🎉🎉🎉🎉🎉
        </Alert>
      )}
    </>
  );
}
