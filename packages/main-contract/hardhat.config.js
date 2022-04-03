require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');

const { privateKey } = require("../../../private.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    local: {
      url: 'http://localhost:9933',
      chainId: 4369,
      accounts:[privateKey]
    }
  },
  abiExporter: {
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: true,
    except: [],
    spacing: 2,
    pretty: true,
  },
};
