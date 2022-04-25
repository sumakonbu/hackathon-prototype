import * as dotenv from "dotenv";
import { providers, Contract, Wallet } from "ethers";

import { privateKey } from "../../../../private.json";
import Abis from "../abis/Greeter.json";

dotenv.config();

const GREETER_ADDRESS = "0xa599e3570AbB54D33a90D337E51018c568efDf77";

async function main() {
  const provider = new providers.JsonRpcProvider(
    "https://rpc.shibuya.astar.network:8545",
    81
  );
  const wallet = new Wallet(privateKey, provider);

  const greeter = new Contract(GREETER_ADDRESS!, Abis, wallet);
  const result = await greeter
    .connect(wallet)
    .setOracle(process.env.ORACLE_ADDRESS!);
  console.log(result);
}

main();
