//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Oracle is AccessControlEnumerable {
    // VerificationToken
    struct VerificationToken {
        uint256 tokenId;
        address user;
        bool passed;
    }
    VerificationToken[] public verificationTokens;
    mapping(address => uint256) private verificationIds;
    uint256 totalSupply = 0;

    // Roles
    bytes32 private constant OWNER_ROLE = keccak256("OWNER_ROLE"); // People to own VerificationToken
    bytes32 private constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE"); // People to manage VerificationToken

    // Events
    event Minted(uint256 tokenId, address indexed user, bool passed);

    constructor() {
        _setupRole(OWNER_ROLE, msg.sender);
        _setupRole(MODERATOR_ROLE, msg.sender);
        _setRoleAdmin(OWNER_ROLE, DEFAULT_ADMIN_ROLE);
    }

    /**
     * Functions to manage Token for MODERATOR_ROLE
     */

    function mint(address user, bool passed) public onlyRole(MODERATOR_ROLE) {
        require(verificationIds[user] > 0, "User already exist!");

        totalSupply = totalSupply + 1;
        uint256 tokenId = totalSupply;

        verificationIds[user] = tokenId;

        VerificationToken memory v;
        v.tokenId = tokenId;
        v.user = user;
        v.passed = passed;
        verificationTokens[tokenId] = v;

        emit Minted(tokenId, user, passed);
    }

    function modify(address user, bool passed)
        public
        onlyRole(MODERATOR_ROLE)
    {}

    function burn(address user) public onlyRole(MODERATOR_ROLE) {}

    function list() public {}

    /**
     * Functions to manage Roles for OWNER_ROLE
     */

    function grantRole(bytes32 role, address account)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

    function revokeRole(bytes32 role, address account)
        public
        override
        onlyRole(OWNER_ROLE)
    {}

    /**
     * Functions to use Token for DeFi apps
     */

    function verify(address target) public view returns (bool) {
        uint256 tokenId = verificationIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return false;
        }

        return verificationTokens[tokenId].passed;
    }
}
