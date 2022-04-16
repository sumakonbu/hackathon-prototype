//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationPersonalToken is OnlyMainContract {
    // VerificationToken
    struct PersonalToken {
        uint256 tokenId;
        address userAddress;
        string countries;
        bool passed;
    }
    address[] public users;
    mapping(address => uint256) public personalTokenIds;
    mapping(uint256 => PersonalToken) public personalTokens;
    uint256 public totalSupply = 0;

    // Events
    event Created(uint256 tokenId, address indexed userAddress, bool passed);

    constructor() {}

    function create(
        address userAddress,
        string memory countries,
        bool passed
    ) public onlyMainContract {
        require(personalTokenIds[userAddress] == 0, "User already exist!");

        uint256 tokenId = totalSupply + 1;

        personalTokenIds[userAddress] = tokenId;

        PersonalToken memory p;
        p.tokenId = tokenId;
        p.userAddress = userAddress;
        p.countries = countries;
        p.passed = passed;
        personalTokens[tokenId] = p;

        // increment totalSupply
        totalSupply = totalSupply + 1;
        users.push(userAddress);

        emit Created(tokenId, userAddress, passed);
    }

    function modify(
        address userAddress,
        string memory countries,
        bool passed
    ) public onlyMainContract {}

    function list() public view onlyMainContract returns (bytes memory) {
        PersonalToken[] memory personalTokenSet = new PersonalToken[](
            users.length
        );
        for (uint256 i = 0; i < users.length; i++) {
            address userAddress = users[i];
            uint256 tokenId = personalTokenIds[userAddress];
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

    /**
     * For debug only
     */
    function purge() public onlyMainContract {
        if (totalSupply == 0) {
            return;
        }

        for (uint256 i = 0; i < users.length; i++) {
            address userAddress = users[i];
            personalTokenIds[userAddress] = 0;
        }
        delete users;
        totalSupply = 0;
    }
}
