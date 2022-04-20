//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    address public oracleAddress;

    constructor(address _oracleAddress) {
        oracleAddress = _oracleAddress;
    }

    function exec() public returns (bool) {
        bytes memory payload = abi.encodeWithSignature("verify(address)", msg.sender);
        (bool success, bytes memory returnData) = address(oracleAddress).call(payload);
        if (success == false) {
            assembly {
                let ptr := mload(0x40)
                let size := returndatasize()
                returndatacopy(ptr, 0, size)
                revert(ptr, size)
            }
        }
        (bool verified) = abi.decode(returnData, (bool));
        require(verified, "Verification failed!");

        return true;
    }

    function setOracle(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
    }
}
