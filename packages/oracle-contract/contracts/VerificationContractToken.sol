//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationContractToken is OnlyMainContract {
    // VerificationToken
    struct ContractToken {
        uint256 tokenId;
        address contractAddress;
        string countries; // 000 - 111
        bool passed;
    }
    address[] public contractAddresses;
    mapping(address => uint256) public contractTokenIds;
    mapping(uint256 => ContractToken) public contractTokens;
    uint256 public totalSupply = 0;

    // Events
    event Created(
        uint256 tokenId,
        address indexed contractAddress,
        string indexed countries,
        bool passed
    );
    event Modified(
        uint256 tokenId,
        address indexed contractAddress,
        string indexed countries,
        bool passed
    );

    constructor() {}

    function create(
        address contractAddress,
        string memory countries,
        bool passed
    ) public onlyMainContract {
        require(
            contractTokenIds[contractAddress] == 0,
            "Contract already exist!"
        );

        // Create token
        uint256 tokenId = totalSupply + 1;
        ContractToken memory p;
        p.tokenId = tokenId;
        p.contractAddress = contractAddress;
        p.countries = countries;
        p.passed = passed;
        contractTokens[tokenId] = p;

        // to make enumerable
        contractTokenIds[contractAddress] = tokenId;
        contractAddresses.push(contractAddress);

        // increment
        totalSupply = totalSupply + 1;

        emit Created(tokenId, contractAddress, countries, passed);
    }

    function modify(
        uint256 tokenId,
        address contractAddress,
        string memory countries,
        bool passed
    ) public onlyMainContract {
        require(
            contractTokenIds[contractAddress] != 0,
            "Contract does not exist!"
        );

        // Modify token
        ContractToken memory p = contractTokens[tokenId];
        p.countries = countries;
        p.passed = passed;
        contractTokens[tokenId] = p;

        emit Modified(tokenId, contractAddress, countries, passed);
    }

    function list() public view onlyMainContract returns (bytes memory) {
        ContractToken[] memory contractTokenSet = new ContractToken[](
            contractAddresses.length
        );
        for (uint256 i = 0; i < contractAddresses.length; i++) {
            address contractAddress = contractAddresses[i];
            uint256 tokenId = contractTokenIds[contractAddress];
            contractTokenSet[i] = contractTokens[tokenId];
        }
        return (abi.encode(contractTokenSet));
    }

    function verify(address target)
        public
        view
        onlyMainContract
        returns (bool, string memory)
    {
        // Verify
        uint256 tokenId = contractTokenIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return (false, "000");
        }

        return (
            contractTokens[tokenId].passed,
            contractTokens[tokenId].countries
        );
    }

    /**
     * For debug only
     */
    function purge() public onlyMainContract returns (bool) {
        if (totalSupply == 0) {
            return true;
        }

        for (uint256 i = 0; i < contractAddresses.length; i++) {
            address contractAddress = contractAddresses[i];
            contractTokenIds[contractAddress] = 0;
        }
        delete contractAddresses;
        totalSupply = 0;
        return true;
    }
}
