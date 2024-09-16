import { ReactNode, useEffect, useState } from "react";
import type { Umi } from "@metaplex-foundation/umi";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { UmiContext } from "./UmiContext";

export default function UmiContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [umi, setUmi] = useState<Umi | null>(null);

  useEffect(() => {
    let umi: Umi | null = null;

    if (wallet.publicKey) {
      umi = createUmi(connection.rpcEndpoint, { commitment: "confirmed" })
        .use(walletAdapterIdentity(wallet))
        .use(mplTokenMetadata())
        .use(mplBubblegum())
        .use(irysUploader());
    }

    setUmi(umi);
  }, [connection.rpcEndpoint, wallet]);

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
}
