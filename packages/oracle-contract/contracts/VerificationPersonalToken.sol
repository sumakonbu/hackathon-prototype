//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationPersonalToken is OnlyMainContract {
    // VerificationToken
    struct PersonalToken {
        uint256 tokenId;
        address userAddress;
        string[3] countries;
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
        string[3] memory countries,
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

        // increment
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

    function verify(address target, string[3] memory countries)
        public
        view
        onlyMainContract
        returns (
            bool isExisted,
            bool isMatched,
            bool isPassed
        )
    {
        // Verify
        uint256 tokenId = personalTokenIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return (false, false, false);
        }

        string[3] memory contractCountries = countries;
        string[3] memory personCountries = personalTokens[tokenId].countries;
        for (uint256 i = 0; i < personCountries.length; i++) {
            for (uint256 j = 0; j < contractCountries.length; j++) {
                if (
                    keccak256(bytes(contractCountries[j])) !=
                    keccak256(bytes("")) &&
                    keccak256(bytes(contractCountries[j])) ==
                    keccak256(bytes(personCountries[i]))
                ) {
                    return (true, true, personalTokens[tokenId].passed);
                }
            }
        }

        return (true, false, personalTokens[tokenId].passed);
    }

    /**
     * For debug only
     */
    function purge() public onlyMainContract returns (bool) {
        if (totalSupply == 0) {
            return true;
        }

        for (uint256 i = 0; i < users.length; i++) {
            address userAddress = users[i];
            personalTokenIds[userAddress] = 0;
        }
        delete users;
        totalSupply = 0;
        return true;
    }
}
