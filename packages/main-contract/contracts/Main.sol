//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Main is AccessControlEnumerable {
    // VerificationToken
    struct VerificationToken {
        address user;
        bool passed;
    }
    mapping(address => VerificationToken) private verificationTokens;

    // Roles
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE"); // People to own VerificationToken
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE"); // People to manage VerificationToken

    // Events
    event Minted(address indexed user, bool passed);

    constructor() {
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(MODERATOR_ROLE, msg.sender);
        _setRoleAdmin(OWNER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
     * Functions to manage Token for MODERATOR_ROLE
     */

    function mint(address user, bool passed) public onlyRole(MODERATOR_ROLE) {
        require(
            verificationTokens[user].user != address(0),
            "User already exist!"
        );

        VerificationToken storage v = verificationTokens[user];
        v.user = user;
        v.passed = passed;

        emit Minted(user, passed);
    }

    function modify(address user, bool passed)
        public
        onlyRole(MODERATOR_ROLE)
    {}

    function burn(address user) public onlyRole(MODERATOR_ROLE) {}

    /**
     * Functions to manage Roles for OWNER_ROLE
     */

    function grantRole(address target, string memory role)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

    function revokeRole(address target, string memory role)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

    /**
     * Functions to use Token for DeFi apps
     */

    function verify(address target)
        public
        view
        returns (bool)
    {}
}
