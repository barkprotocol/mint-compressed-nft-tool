import { useState } from "react";
import useMinter from "../hooks/useMinter";
import ImageUploader from "./ImageUploader";
import MetadataUploader from "./MetadataUploader";
import {
  useCollectionAddressStore,
  useNftImageUrlStore,
  useNftMetadataUrlStore,
  useTransactionStateStore,
} from "../store/minterStore";
import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { toast } from "react-toastify";

const NFT_PLACEHOLDERS = {
  imageUrl: "Image URL",
  mimeType: "MIME Type",
  metadataUrl: "Metadata URL",
  name: "Name",
  symbol: "Symbol",
  addresses: "Comma-separated addresses",
};

export default function Nft() {
  const { mintToCollection } = useMinter();

  const [formState, setFormState] = useState({
    localImageUrl: "",
    localImageMimeType: "",
    localMetadataUrl: "",
    localName: "",
    localSymbol: "",
    localAddresses: "",
  });

  const { localImageUrl, localImageMimeType, localMetadataUrl, localName, localSymbol, localAddresses } = formState;

  const collectionAddress = useCollectionAddressStore((state) => state.address);
  const transactionInProgress = useTransactionStateStore((state) => state.transactionInProgress);

  const imageUrl = useNftImageUrlStore((state) => state.url);
  const imageMimeType = useNftImageUrlStore((state) => state.mimeType);
  const setImageUrl = useNftImageUrlStore((state) => state.setUrl);
  const setImageMimeType = useNftImageUrlStore((state) => state.setMimeType);

  const metadataUrl = useNftMetadataUrlStore((state) => state.url);
  const setMetadataUrl = useNftMetadataUrlStore((state) => state.setUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleMintToCollection = async () => {
    if (!collectionAddress || !metadataUrl) {
      toast.error("Collection address or metadata URL is missing");
      return;
    }

    let addresses: PublicKey[];

    try {
      addresses = localAddresses.split(",").map((x) => publicKey(x.trim()));
    } catch (error) {
      toast.error("One or more addresses are invalid");
      console.error(error);
      return;
    }

    try {
      await mintToCollection(localName, localSymbol, metadataUrl, addresses);
      toast.success("NFT minted successfully!");
    } catch (error) {
      toast.error("Failed to mint NFT");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h3 className="pb-4 text-xl font-semibold">cNFT</h3>

      <div className="grid w-full gap-8 rounded-md bg-white p-4 shadow-md">
        <div className="flex flex-col gap-2 break-all">
          <div>Image URL: {imageUrl}</div>
          <div>Image MIME Type: {imageMimeType}</div>
          <div>Metadata URL: {metadataUrl}</div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="localImageUrl"
              placeholder={NFT_PLACEHOLDERS.imageUrl}
              value={localImageUrl}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
              aria-label={NFT_PLACEHOLDERS.imageUrl}
            />

            <input
              type="text"
              name="localImageMimeType"
              placeholder={NFT_PLACEHOLDERS.mimeType}
              value={localImageMimeType}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
              aria-label={NFT_PLACEHOLDERS.mimeType}
            />

            <button
              type="button"
              className="flex-1 btn btn-md btn-black"
              disabled={transactionInProgress || !localImageMimeType || !localImageUrl}
              onClick={() => {
                setImageUrl(localImageUrl);
                setImageMimeType(localImageMimeType);
                setFormState(prev => ({
                  ...prev,
                  localImageUrl: "",
                  localImageMimeType: "",
                }));
              }}
            >
              Set Image Data
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="localMetadataUrl"
              placeholder={NFT_PLACEHOLDERS.metadataUrl}
              value={localMetadataUrl}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
              aria-label={NFT_PLACEHOLDERS.metadataUrl}
            />

            <button
              type="button"
              className="flex-1 btn btn-md btn-black"
              disabled={transactionInProgress || !localMetadataUrl}
              onClick={() => {
                setMetadataUrl(localMetadataUrl);
                setFormState(prev => ({
                  ...prev,
                  localMetadataUrl: "",
                }));
              }}
            >
              Set Metadata URL
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="localName"
              placeholder={NFT_PLACEHOLDERS.name}
              value={localName}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
              aria-label={NFT_PLACEHOLDERS.name}
            />

            <input
              type="text"
              name="localSymbol"
              placeholder={NFT_PLACEHOLDERS.symbol}
              value={localSymbol}
              onChange={handleInputChange}
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
              aria-label={NFT_PLACEHOLDERS.symbol}
            />
          </div>

          <textarea
            rows={3}
            name="localAddresses"
            placeholder={NFT_PLACEHOLDERS.addresses}
            value={localAddresses}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            aria-label={NFT_PLACEHOLDERS.addresses}
          />

          <div className="text-center">
            <button
              type="button"
              className="btn btn-lg btn-black w-full"
              disabled={
                transactionInProgress ||
                !collectionAddress ||
                !localName ||
                !localSymbol ||
                !localAddresses ||
                !metadataUrl
              }
              onClick={handleMintToCollection}
            >
              Mint NFTs
            </button>
          </div>
        </div>

        <ImageUploader type="nft" />
        <MetadataUploader type="nft" />
      </div>
    </div>
  );
}
