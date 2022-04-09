//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract OnlyMainContract {
    address private owner;
    address private mainContract;

    event MainContractSet(address indexed newAddress);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            owner == msg.sender,
            "OnlyMainContract: caller is not the owner"
        );
        _;
    }

    modifier onlyMainContract() {
        require(
            mainContract == msg.sender,
            "OnlyMainContract: caller is not the MainContract"
        );
        _;
    }

    function setMainContractAddress(address _mainContract)
        public
        onlyOwner
    {
        mainContract = _mainContract;
        emit MainContractSet(mainContract);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
