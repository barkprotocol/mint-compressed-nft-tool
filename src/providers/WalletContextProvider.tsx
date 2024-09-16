import { ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Cluster, clusterApiUrl } from "@solana/web3.js";
import "./WalletContextProvider.css";

const getEndpoint = (): string => {
  const rpcUrl = import.meta.env.VITE_RPC_URL;

  if (!rpcUrl || rpcUrl === "") {
    return clusterApiUrl(import.meta.env.VITE_SOL_CLUSTER as Cluster);
  }

  return rpcUrl;
};

export default function WalletContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const endpoint = getEndpoint();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
