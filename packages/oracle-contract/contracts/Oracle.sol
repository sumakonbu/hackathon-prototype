//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

import "./VerificationPersonalToken.sol";
import "./VerificationContractToken.sol";

contract Oracle is AccessControlEnumerable {
    // Composition
    address public verificationPersonalTokenAddress;
    VerificationPersonalToken private verificationPersonalToken;
    address public verificationContractTokenAddress;
    VerificationContractToken private verificationContractToken;

    // Roles
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE"); // People to own VerificationToken
    bytes32 private constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE"); // People to manage VerificationToken

    // Events
    event Minted(uint256 tokenId, address indexed userAddress, bool passed);
    event VerificationPersonalTokenAddressSet(address indexed newAddress);
    event VerificationContractTokenAddressSet(address indexed newAddress);

    constructor() {
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(MODERATOR_ROLE, msg.sender);
    }

    /**
     * Functions to manage Personal Token for MODERATOR_ROLE
     */

    function createPersonalToken(
        address userAddress,
        string memory countries,
        bool passed
    ) public onlyRole(MODERATOR_ROLE) {
        verificationPersonalToken.create(userAddress, countries, passed);
    }

    function modifyPersonalToken(address userAddress, bool passed)
        public
        onlyRole(MODERATOR_ROLE)
    {}

    function listPersonalToken() public view returns (bytes memory) {
        return verificationPersonalToken.list();
    }

    /**
     * Functions to manage Contract Token for MODERATOR_ROLE
     */

    function createContractToken(
        address contractAddress,
        string memory countries,
        bool passed
    ) public onlyRole(MODERATOR_ROLE) {
        verificationContractToken.create(contractAddress, countries, passed);
    }

    function modifyContractToken(address contractAddress, bool passed)
        public
        onlyRole(MODERATOR_ROLE)
    {}

    function listContractToken() public view returns (bytes memory) {
        return verificationContractToken.list();
    }

    /**
     * Functions to manage Roles for OWNER_ROLE
     */

    // override AccessControlEnumerable
    function grantRole(bytes32 role, address account) public override {
        if (role == OWNER_ROLE) {
            _grantRole(OWNER_ROLE, account);
        } else if (role == MODERATOR_ROLE) {
            _grantRole(MODERATOR_ROLE, account);
        }
    }

    // override AccessControlEnumerable
    function revokeRole(bytes32 role, address account)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

    function setVerificationPersonalToken(address _verificationPersonalToken)
        public
        onlyRole(OWNER_ROLE)
    {
        verificationPersonalTokenAddress = _verificationPersonalToken;
        verificationPersonalToken = VerificationPersonalToken(
            verificationPersonalTokenAddress
        );
        emit VerificationPersonalTokenAddressSet(
            verificationPersonalTokenAddress
        );
    }

    function setVerificationContractToken(address _verificationContractToken)
        public
        onlyRole(OWNER_ROLE)
    {
        verificationContractTokenAddress = _verificationContractToken;
        verificationContractToken = VerificationContractToken(
            verificationContractTokenAddress
        );
        emit VerificationContractTokenAddressSet(
            verificationContractTokenAddress
        );
    }

    /**
     * Functions to use Token
     */

    function verify(address target) public view returns (bool) {
        (bool passed, string memory countries) = verificationContractToken
            .verify(msg.sender);
        require(passed, "Contract not verified!");
        (
            bool isExisted,
            bool isMatched,
            bool isPassed
        ) = verificationPersonalToken.verify(target, countries);
        require(isExisted, "User not registerd!");
        require(isMatched, "User not allowed!");
        require(isPassed, "User not verified!");

        return true;
    }

    /**
     * For debug only
     */
    function purge() public onlyRole(MODERATOR_ROLE) {
        require(verificationPersonalToken.purge(), "PersonalToken failed.");
        require(verificationContractToken.purge(), "ContractToken failed.");
    }
}
