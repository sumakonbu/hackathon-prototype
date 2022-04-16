import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { solidityKeccak256 } from "ethers/lib/utils";
import { ethers } from "hardhat";

import {
  Oracle,
  SampleMock,
  VerificationContractToken,
  VerificationPersonalToken,
} from "../typechain";

describe("Oracle", function () {
  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;

  let oracle: Oracle;
  let verificationPersonalToken: VerificationPersonalToken;
  let verificationContractToken: VerificationContractToken;
  let sampleMock: SampleMock;

  const OWNER_ROLE = solidityKeccak256(["string"], ["OWNER_ROLE"]);
  const MODERATOR_ROLE = solidityKeccak256(["string"], ["MODERATOR_ROLE"]);

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    // Create contract
    const Oracle = await ethers.getContractFactory("Oracle");
    oracle = await (await Oracle.deploy()).deployed();
    const VerificationPersonalToken = await ethers.getContractFactory(
      "VerificationPersonalToken"
    );
    verificationPersonalToken = await (
      await VerificationPersonalToken.deploy()
    ).deployed();
    const VerificationContractToken = await ethers.getContractFactory(
      "VerificationContractToken"
    );
    verificationContractToken = await (
      await VerificationContractToken.deploy()
    ).deployed();
    const SampleMock = await ethers.getContractFactory("SampleMock");
    sampleMock = await (await SampleMock.deploy(oracle.address)).deployed();

    // After work
    await oracle
      .connect(deployer)
      .setVerificationPersonalToken(verificationPersonalToken.address);
    await oracle
      .connect(deployer)
      .setVerificationContractToken(verificationContractToken.address);
    await verificationPersonalToken
      .connect(deployer)
      .setMainContractAddress(oracle.address);
    await verificationContractToken
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
        .createPersonalToken(accounts[1].address, "JPN,USA", true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'User already exist!'", async function () {
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[2].address, "JPN,USA", true);
      await expect(
        oracle
          .connect(deployer)
          .createPersonalToken(accounts[2].address, "JPN,USA", true)
      ).to.revertedWith("User already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .createPersonalToken(accounts[2].address, "JPN,USA", true)
      ).to.revertedWith("AccessControl: account");
    });
  });

  describe("createContractToken", function () {
    it("Should call correctly", async function () {
      const txResult = await oracle
        .connect(deployer)
        .createContractToken(accounts[1].address, "JPN,USA", true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'Contract already exist!'", async function () {
      await oracle
        .connect(deployer)
        .createContractToken(accounts[2].address, "JPN,USA", true);
      await expect(
        oracle
          .connect(deployer)
          .createContractToken(accounts[2].address, "JPN,USA", true)
      ).to.revertedWith("Contract already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .createContractToken(accounts[2].address, "JPN,USA", true)
      ).to.revertedWith("AccessControl: account");
    });
  });

  describe("verify", function () {
    beforeEach(async function () {
      // Prepare verified address.
      await oracle
        .connect(deployer)
        .createContractToken(sampleMock.address, "JPN,USA", true);
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[1].address, "JPN", true);
    });

    it("Should be executed correctly", async function () {
      await expect(sampleMock.connect(deployer).exec(accounts[1].address)).to.be
        .ok;
    });

    it("Should be reverted with 'Contract not verified!'", async function () {
      const notVerifiedContract = oracle;
      await expect(
        notVerifiedContract.connect(deployer).verify(accounts[1].address)
      ).to.revertedWith("Contract not verified!");
    });

    it("Should be reverted with 'User not verified!'", async function () {
      const notVerifiedUser = accounts[2].address;
      await expect(
        sampleMock.connect(deployer).exec(notVerifiedUser)
      ).to.revertedWith("User not verified!");
    });
  });
});
