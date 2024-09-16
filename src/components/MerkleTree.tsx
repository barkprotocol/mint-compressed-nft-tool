import { useState } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import {
  useMerkleTreeAddressStore,
  useTransactionStateStore,
} from "../store/minterStore";
import useMinter from "../hooks/useMinter";
import { toast } from "react-toastify";

export default function MerkleTree() {
  const { createMerkleTree } = useMinter();
  const [address, setAddress] = useState("");
  const [maxDepth, setMaxDepth] = useState("");
  const [maxBufferSize, setMaxBufferSize] = useState("");
  const [canopyDepth, setCanopyDepth] = useState("");

  const transactionInProgress = useTransactionStateStore(
    (state) => state.transactionInProgress
  );

  const merkleTreeAddress = useMerkleTreeAddressStore((state) => state.address);
  const setMerkleTreeAddress = useMerkleTreeAddressStore(
    (state) => state.setAddress
  );

  const handleCreateMerkleTree = async () => {
    let maxDepthNumber: number,
      maxBufferSizeNumber: number,
      canopyDepthNumber: number;

    try {
      maxDepthNumber = Number.parseInt(maxDepth);
      maxBufferSizeNumber = Number.parseInt(maxBufferSize);
      canopyDepthNumber = Number.parseInt(canopyDepth);

      if (
        isNaN(maxDepthNumber) ||
        isNaN(maxBufferSizeNumber) ||
        isNaN(canopyDepthNumber)
      ) {
        throw new Error("Invalid input values");
      }

      await createMerkleTree(maxDepthNumber, maxBufferSizeNumber, canopyDepthNumber);
      toast.success("Merkle Tree created successfully!");
      setMaxDepth("");
      setMaxBufferSize("");
      setCanopyDepth("");
      setAddress(""); // Also reset address
    } catch (error) {
      toast.error("Merkle Tree creation failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h3 className="pb-4 text-xl font-semibold">Merkle Tree</h3>

      <div className="grid w-full gap-6 rounded-md bg-white p-6 shadow-md">
        <div className="text-gray-700 mb-4">
          Address: {merkleTreeAddress?.toString()}
        </div>
        <div className="mb-4">
          <a
            href="https://compressed.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Calculator
          </a>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />

          <button
            type="button"
            className="btn btn-md btn-black"
            disabled={transactionInProgress || !address}
            onClick={() => {
              try {
                setMerkleTreeAddress(publicKey(address));
                toast.success("Merkle Tree Address set successfully!");
                setAddress("");
              } catch (error) {
                toast.error("Invalid Address");
                console.error(error);
              }
            }}
          >
            Set Merkle Tree Address
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="maxDepth">Max depth</label>
          <input
            id="maxDepth"
            type="number"
            placeholder="Max depth"
            step={1}
            min={0}
            value={maxDepth}
            onChange={(event) => setMaxDepth(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />

          <label className="sr-only" htmlFor="maxBufferSize">Max buffer size</label>
          <input
            id="maxBufferSize"
            type="number"
            placeholder="Max buffer size"
            step={1}
            min={0}
            value={maxBufferSize}
            onChange={(event) => setMaxBufferSize(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />

          <label className="sr-only" htmlFor="canopyDepth">Canopy depth</label>
          <input
            id="canopyDepth"
            type="number"
            placeholder="Canopy depth"
            step={1}
            min={0}
            value={canopyDepth}
            onChange={(event) => setCanopyDepth(event.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />

          <button
            type="button"
            className="btn btn-md btn-black"
            disabled={
              transactionInProgress || !maxDepth || !maxBufferSize || !canopyDepth
            }
            onClick={handleCreateMerkleTree}
          >
            Create Merkle Tree
          </button>
        </div>
      </div>
    </div>
  );
}
