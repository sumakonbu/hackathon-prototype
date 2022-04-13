//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationPersonalToken is OnlyMainContract {
    // VerificationToken
    struct PersonalToken {
        uint256 tokenId;
        address user;
        string countries;
        bool passed;
    }
    address[] public users;
    mapping(address => uint256) public personalTokenIds;
    mapping(uint256 => PersonalToken) public personalTokens;
    uint256 public totalSupply = 0;

    // Events
    event Created(uint256 tokenId, address indexed user, bool passed);

    constructor() {}

    function create(
        address user,
        string memory countries,
        bool passed
    ) public onlyMainContract {
        require(personalTokenIds[user] == 0, "User already exist!");

        uint256 tokenId = totalSupply + 1;

        personalTokenIds[user] = tokenId;

        PersonalToken memory p;
        p.tokenId = tokenId;
        p.user = user;
        p.countries = countries;
        p.passed = passed;
        personalTokens[tokenId] = p;

        // increment totalSupply
        totalSupply = totalSupply + 1;
        users.push(user);

        emit Created(tokenId, user, passed);
    }

    function modify(address user, bool passed) public onlyMainContract {}

    function list() public view onlyMainContract returns (bytes memory) {
        PersonalToken[] memory personalTokenSet = new PersonalToken[](users.length);
        for(uint256 i=0; i < users.length; i++) {
            address user = users[i];
            uint256 tokenId = personalTokenIds[user];
            personalTokenSet[i] = personalTokens[tokenId];
        }
        return (abi.encode(personalTokenSet));
    }

    function verify(address target)
        public
        view
        onlyMainContract
        returns (bool)
    {
        // Verify
        uint256 tokenId = personalTokenIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return false;
        }

        return personalTokens[tokenId].passed;
    }
}
