import { Umi } from "@metaplex-foundation/umi";
import { createContext } from "react";

export type UmiContext = {
  umi: Umi | null;
};

const DEFAULT_CONTEXT: UmiContext = {
  umi: null,
};

export const UmiContext = createContext<UmiContext>(DEFAULT_CONTEXT);
