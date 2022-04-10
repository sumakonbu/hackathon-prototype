import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { solidityKeccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";

import { Oracle, VerificationPersonalToken } from "../typechain";

describe("Oracle", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;

  let oracle: Oracle;
  let verificationPersonalToken: VerificationPersonalToken;

  const OWNER_ROLE = solidityKeccak256(["string"], ["OWNER_ROLE"]);
  const MODERATOR_ROLE = solidityKeccak256(["string"], ["MODERATOR_ROLE"]);

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

  describe("role", function () {
    it("Should set ROLE up", async function () {
      const ownerRole = await oracle
        .connect(deployer)
        .getRoleMember(OWNER_ROLE, 0);
      expect(ownerRole).to.eq(deployer.address);

      const moderatorRole = await oracle
        .connect(deployer)
        .getRoleMember(MODERATOR_ROLE, 0);
      expect(moderatorRole).to.eq(deployer.address);
    });

    it("Should not have ROLE", async function () {
      const hasOwnerRole = await oracle
        .connect(deployer)
        .hasRole(OWNER_ROLE, accounts[1].address);
      expect(hasOwnerRole).to.false;

      const hasModeratorRole = await oracle
        .connect(deployer)
        .hasRole(MODERATOR_ROLE, accounts[1].address);
      expect(hasModeratorRole).to.false;
    });
  });

  describe("createPersonalToken", function () {
    it("Should call correctly", async function () {
      const txResult = await oracle
        .connect(deployer)
        .createPersonalToken(accounts[1].address, ["jp"], true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'User already exist!'", async function () {
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[2].address, ["jp"], true);
      await expect(
        oracle
          .connect(deployer)
          .createPersonalToken(accounts[2].address, ["jp"], true)
      ).to.revertedWith("User already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .createPersonalToken(accounts[2].address, ["jp"], true)
      ).to.revertedWith("AccessControl: account");
    });
  });
});
