//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

import "./VerificationPersonalToken.sol";

contract Oracle is AccessControlEnumerable {
    // Composition
    address public verificationPersonalTokenAddress;
    VerificationPersonalToken private verificationPersonalToken;

    // Roles
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE"); // People to own VerificationToken
    bytes32 private constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE"); // People to manage VerificationToken

    // Events
    event Minted(uint256 tokenId, address indexed user, bool passed);
    event VerificationPersonalTokenAddressSet(address indexed newAddress);

    constructor() {
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(MODERATOR_ROLE, msg.sender);
        _setRoleAdmin(OWNER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
     * Functions to manage Token for MODERATOR_ROLE
     */

    function create(address user, bool passed) public onlyRole(MODERATOR_ROLE) {
        verificationPersonalToken.create(user, passed);
    }

    function modify(address user, bool passed)
        public
        onlyRole(MODERATOR_ROLE)
    {}

    function list() public {}

    /**
     * Functions to manage Roles for OWNER_ROLE
     */

    // override AccessControlEnumerable
    function grantRole(bytes32 role, address account)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

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

    /**
     * Functions to use Token
     */

    function verify(address target) public view returns (bool) {}
}
