import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export default function Header() {
  const [balance, setBalance] = useState(0);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      { commitment: "confirmed" }
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [connection, publicKey]);

  return (
    <header className="fixed top-0 z-20 w-full bg-white border-b shadow-md">
      <nav className="flex items-center justify-between h-16 px-6 sm:px-12 lg:px-20">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="https://ucarecdn.com/b065ba1f-6279-4677-ae8f-0ebc1facb68d/bark_icon.png"
            alt="Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="ml-4 text-xl font-bold tracking-wide text-gray-800">NFT Mint Tool</span>
        </div>

        {/* Wallet and Balance Info */}
        <div className="flex items-center gap-6">
          {publicKey ? (
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600">Balance:</span>
              <span className="text-lg font-medium text-gray-900">{balance.toFixed(2)} SOL</span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Connect Wallet</div>
          )}

          <WalletMultiButton className="bg-gray-800 text-white px-4 py-2 rounded-md" />
        </div>
      </nav>
    </header>
  );
}
