import { ReactNode } from "react";
import WalletContextProvider from "./WalletContextProvider";
import UmiProvider from "./UmiContextProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletContextProvider>
      <UmiProvider>{children}</UmiProvider>
    </WalletContextProvider>
  );
}
