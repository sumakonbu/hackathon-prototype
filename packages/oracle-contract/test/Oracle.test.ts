import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { Oracle, VerificationPersonalToken } from "../typechain";

describe("Oracle", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;

  let oracle: Oracle;
  let verificationPersonalToken: VerificationPersonalToken;

  before(async function () {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    console.log("accounts:", accounts[0].address, accounts[1].address);

    const Oracle = await ethers.getContractFactory("Oracle");
    oracle = await (await Oracle.deploy()).deployed();

    const VerificationPersonalToken = await ethers.getContractFactory(
      "VerificationPersonalToken"
    );
    verificationPersonalToken = await (
      await VerificationPersonalToken.deploy()
    ).deployed();

    await oracle
      .connect(deployer)
      .setVerificationPersonalToken(verificationPersonalToken.address);
    await verificationPersonalToken
      .connect(deployer)
      .setMainContractAddress(oracle.address);
  });

  describe("create", function () {
    it("Should call correctly", async function () {
      const txResult = await oracle
        .connect(deployer)
        .create(accounts[1].address, true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'User already exist!'", async function () {
      await oracle.connect(deployer).create(accounts[2].address, true);
      await expect(
        oracle.connect(deployer).create(accounts[2].address, true)
      ).to.revertedWith("User already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .create(accounts[2].address, true)
      ).to.revertedWith("AccessControl: account");
    });
  });
});
