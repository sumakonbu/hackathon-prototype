// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { solidityKeccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { deployer } from "../../../../private.json";

async function main() {
  const signer = await ethers.getSigner(deployer);

  // Deploy MainContract
  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy();
  await oracle.deployed();
  console.log("OracleContract deployed to:", oracle.address);
  console.log(
    `owner role has ${await oracle
      .connect(signer)
      .getRoleMember(solidityKeccak256(["string"], ["OWNER_ROLE"]), 0)}`
  );

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
  const setVerificationPersonalTokenResult = await oracle
    .connect(signer)
    .setVerificationPersonalToken(verificationPersonalToken.address);
  console.log(
    "Oracle setVerificationPersonalToken:",
    setVerificationPersonalTokenResult
  );
  const setMainContractAddressResult = await verificationPersonalToken
    .connect(signer)
    .setMainContractAddress(oracle.address);
  console.log(
    "verificationPersonalToken setMainContractAddressResult:",
    setMainContractAddressResult
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
