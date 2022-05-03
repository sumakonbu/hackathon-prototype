/* eslint-disable no-unused-expressions */
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

  const defaultCountries: string = "011"; // JPN, USA

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

    it("Should be granted OWNER_ROLE", async function () {
      const hasOwnerRoleBefore = await oracle
        .connect(deployer)
        .hasRole(OWNER_ROLE, accounts[1].address);
      expect(hasOwnerRoleBefore).to.false;

      await oracle.connect(deployer).grantRole(OWNER_ROLE, accounts[1].address);

      const hasOwnerRoleAfter = await oracle
        .connect(deployer)
        .hasRole(OWNER_ROLE, accounts[1].address);
      expect(hasOwnerRoleAfter).to.true;
    });

    it("Should be revoked OWNER_ROLE", async function () {
      await oracle.connect(deployer).grantRole(OWNER_ROLE, accounts[1].address);

      const hasOwnerRoleBefore = await oracle
        .connect(deployer)
        .hasRole(OWNER_ROLE, accounts[1].address);
      expect(hasOwnerRoleBefore).to.true;

      await oracle
        .connect(deployer)
        .revokeRole(OWNER_ROLE, accounts[1].address);

      const hasOwnerRoleAfter = await oracle
        .connect(deployer)
        .hasRole(OWNER_ROLE, accounts[1].address);
      expect(hasOwnerRoleAfter).to.false;
    });
  });

  describe("createPersonalToken", function () {
    it("Should call correctly", async function () {
      const txResult = await oracle
        .connect(deployer)
        .createPersonalToken(accounts[1].address, defaultCountries, true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'User already exist!'", async function () {
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[2].address, defaultCountries, true);
      await expect(
        oracle
          .connect(deployer)
          .createPersonalToken(accounts[2].address, defaultCountries, true)
      ).to.revertedWith("User already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .createPersonalToken(accounts[2].address, defaultCountries, true)
      ).to.revertedWith("AccessControl: account");
    });
  });

  describe("createContractToken", function () {
    it("Should call correctly", async function () {
      const txResult = await oracle
        .connect(deployer)
        .createContractToken(accounts[1].address, defaultCountries, true);
      expect(txResult.hash).to.be.ok;
    });

    it("Should revert with 'Contract already exist!'", async function () {
      await oracle
        .connect(deployer)
        .createContractToken(accounts[2].address, defaultCountries, true);
      await expect(
        oracle
          .connect(deployer)
          .createContractToken(accounts[2].address, defaultCountries, true)
      ).to.revertedWith("Contract already exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .createContractToken(accounts[2].address, defaultCountries, true)
      ).to.revertedWith("AccessControl: account");
    });
  });

  describe("modifyContractToken", function () {
    it("Should call correctly", async function () {
      const expectedCountries = "111";

      // pre-create
      await oracle
        .connect(deployer)
        .createContractToken(accounts[1].address, defaultCountries, true);

      // exec to modfiy
      const txResult = await oracle
        .connect(deployer)
        .modifyContractToken(1, accounts[1].address, expectedCountries, true);
      expect(txResult.hash).to.be.ok;

      // assert that data changed.
      const token = await verificationContractToken
        .connect(deployer)
        .contractTokens(1);
      expect(token.countries).to.eq(expectedCountries);
    });

    it("Should revert with 'Contract does not exist!'", async function () {
      await expect(
        oracle
          .connect(deployer)
          .modifyContractToken(1, accounts[1].address, defaultCountries, true)
      ).to.revertedWith("Contract does not exist!");
    });

    it("Should revert if caller doesn't have MODERATOR_ROLE", async function () {
      const accountWithoutModeratorRole = accounts[1];
      await expect(
        oracle
          .connect(accountWithoutModeratorRole)
          .modifyContractToken(1, accounts[1].address, defaultCountries, true)
      ).to.revertedWith("AccessControl: account");
    });
  });

  describe("verify", function () {
    beforeEach(async function () {
      // Prepare verified address.
      await oracle
        .connect(deployer)
        .createContractToken(sampleMock.address, defaultCountries, true);
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[1].address, "001", true);
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[2].address, "100", true);
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[3].address, "010", false);
    });

    it("Should be executed correctly", async function () {
      const result = await sampleMock
        .connect(deployer)
        .exec(accounts[1].address);
      expect(result).to.be.true;
    });

    it("Should be reverted with 'Contract not verified!'", async function () {
      const notVerifiedContract = oracle;
      await expect(
        notVerifiedContract.connect(deployer).verify(accounts[1].address)
      ).to.revertedWith("Contract not verified!");
    });

    it("Should be reverted with 'User not registerd!'", async function () {
      const notVerifiedUser = accounts[0].address;
      await expect(
        sampleMock.connect(deployer).exec(notVerifiedUser)
      ).to.revertedWith("User not registerd!");
    });

    it("Should be reverted with 'User not allowed!'", async function () {
      const notVerifiedUser = accounts[2].address;
      await expect(
        sampleMock.connect(deployer).exec(notVerifiedUser)
      ).to.revertedWith("User not allowed!");
    });

    it("Should be reverted with 'User not verified!'", async function () {
      const notVerifiedUser = accounts[3].address;
      await expect(
        sampleMock.connect(deployer).exec(notVerifiedUser)
      ).to.revertedWith("User not verified!");
    });
  });

  describe("debug functions", function () {
    it("should be purged all data", async function () {
      await expect(oracle.connect(deployer).purge()).to.be.ok;

      // create data
      await oracle
        .connect(deployer)
        .createPersonalToken(accounts[1].address, defaultCountries, true);
      await oracle
        .connect(deployer)
        .createContractToken(accounts[1].address, defaultCountries, true);

      // assert before purge
      let personalTokens = decode(
        await oracle.connect(deployer).listPersonalToken()
      );
      let contractTokens = decode(
        await oracle.connect(deployer).listContractToken()
      );
      expect(personalTokens[0].length).to.eq(1);
      expect(contractTokens[0].length).to.eq(1);

      await oracle.connect(deployer).purge();

      // assert after purge
      personalTokens = decode(
        await oracle.connect(deployer).listPersonalToken()
      );
      contractTokens = decode(
        await oracle.connect(deployer).listContractToken()
      );
      expect(personalTokens[0].length).to.eq(0);
      expect(contractTokens[0].length).to.eq(0);
    });
  });
});

function decode(data: string) {
  return ethers.utils.defaultAbiCoder.decode(
    ["tuple(uint256 tokenId, address user, string countries, bool passed)[]"],
    data
  );
}
