//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationPersonalToken is OnlyMainContract {
    // VerificationToken
    struct PersonalToken {
        uint256 tokenId;
        address user;
        bool passed;
    }
    PersonalToken[] private personalTokens;
    mapping(address => uint256) private verificationIds;
    uint256 private totalSupply = 0;

    // Events
    event Created(uint256 tokenId, address indexed user, bool passed);

    constructor() {}

    function create(address user, bool passed) public onlyMainContract {
        require(verificationIds[user] > 0, "User already exist!");

        totalSupply = totalSupply + 1;
        uint256 tokenId = totalSupply;

        verificationIds[user] = tokenId;

        PersonalToken memory p;
        p.tokenId = tokenId;
        p.user = user;
        p.passed = passed;
        personalTokens[tokenId] = p;

        emit Created(tokenId, user, passed);
    }

    function modify(address user, bool passed) public onlyMainContract {}

    function list() public onlyMainContract {}

    function verify(address target)
        public
        view
        onlyMainContract
        returns (bool)
    {
        // Verify
        uint256 tokenId = verificationIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return false;
        }

        return personalTokens[tokenId].passed;
    }
}
