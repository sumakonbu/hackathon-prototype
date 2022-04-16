//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Dependencies/OnlyMainContract.sol";

contract VerificationContractToken is OnlyMainContract {
    // VerificationToken
    struct ContractToken {
        uint256 tokenId;
        address contractAddress;
        string countries;
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

        uint256 tokenId = totalSupply + 1;

        contractTokenIds[contractAddress] = tokenId;

        ContractToken memory p;
        p.tokenId = tokenId;
        p.contractAddress = contractAddress;
        p.countries = countries;
        p.passed = passed;
        contractTokens[tokenId] = p;

        // increment
        totalSupply = totalSupply + 1;
        contractAddresses.push(contractAddress);

        emit Created(tokenId, contractAddress, passed);
    }

    function modify(address contractAddress, bool passed)
        public
        onlyMainContract
    {}

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
        returns (bool)
    {
        // Verify
        uint256 tokenId = contractTokenIds[target];
        if (tokenId == 0) {
            // token doesn't exist.
            return false;
        }

        return contractTokens[tokenId].passed;
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
