// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const signer = await ethers.getSigner();

  // Deploy MainContract
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();

  await oracle.deployed();
  console.log("OracleContract deployed to:", oracle.address);

  // Deploy VerificationPersonalToken
  const VerificationPersonalToken = await ethers.getContractFactory(
    "VerificationPersonalToken"
  );
  const verificationPersonalToken = await VerificationPersonalToken.deploy();

  await verificationPersonalToken.deployed();
  console.log(
    "VerificationPersonalToken deployed to:",
    verificationPersonalToken.address
  );

  // After work
  oracle
    .connect(signer)
    .setVerificationPersonalToken(verificationPersonalToken.address);
  verificationPersonalToken
    .connect(signer)
    .setMainContractAddress(oracle.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
