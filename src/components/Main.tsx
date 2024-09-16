import { useWallet } from "@solana/wallet-adapter-react";
import { Slide, ToastContainer } from "react-toastify";
import Airdrop from "./Airdrop";
import MerkleTree from "./MerkleTree";
import Collection from "./Collection";
import Nft from "./Nft";
import "react-toastify/dist/ReactToastify.css";

export default function Main() {
  const { publicKey, connected } = useWallet();

  return (
    <main className="mt-20 flex h-full w-full flex-grow items-center justify-center px-8 py-8 sm:px-16">
      {connected ? (
        publicKey ? (
          <div className="mx-auto grid w-full max-w-7xl gap-12">
            <Airdrop />
            <MerkleTree />
            <Collection />
            <Nft />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-lg">
            <div className="w-full rounded-md bg-white p-8 text-center shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800">
                Connect a Wallet to Continue
              </h3>
              <p className="mt-4 text-gray-600">
                To access your airdrops, view collections, and mint NFTs, please
                connect your Solana wallet.
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="mx-auto w-full max-w-lg">
          <div className="w-full rounded-md bg-white p-8 text-center shadow-md">
            <h3 className="text-2xl font-semibold text-gray-800">
              Connecting Wallet...
            </h3>
            <p className="mt-4 text-gray-600">
              Please wait while we establish a connection with your Solana wallet.
            </p>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </main>
  );
}
