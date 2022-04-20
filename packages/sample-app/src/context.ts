import { createContext } from "react";

export const TransactionContext = createContext({
  hash: "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setHash: (hash: string) => {},
});
