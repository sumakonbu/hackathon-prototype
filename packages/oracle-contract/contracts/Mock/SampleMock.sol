//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../Oracle.sol";

contract SampleMock {
    Oracle private oracle;

    constructor(address _oracleAddress) {
        oracle = Oracle(_oracleAddress);
    }

    function exec(address userAddress) public view returns (bool) {
        oracle.verify(userAddress);

        return true;
    }
}
