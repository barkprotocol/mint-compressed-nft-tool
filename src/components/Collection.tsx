import { publicKey } from "@metaplex-foundation/umi";
import { useState } from "react";
import useMinter from "../hooks/useMinter";
import {
  useCollectionAddressStore,
  useCollectionImageUrlStore,
  useCollectionMetadataUrlStore,
  useTransactionStateStore,
} from "../store/minterStore";
import ImageUploader from "./ImageUploader";
import MetadataUploader from "./MetadataUploader";

export default function Collection() {
  const { createCollection } = useMinter();

  const [formData, setFormData] = useState({
    address: "",
    imageUrl: "",
    imageMimeType: "",
    metadataUrl: "",
    collectionName: "",
    collectionSymbol: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const address = useCollectionAddressStore((state) => state.address);
  const setAddress = useCollectionAddressStore((state) => state.setAddress);
  
  const imageUrl = useCollectionImageUrlStore((state) => state.url);
  const imageMimeType = useCollectionImageUrlStore((state) => state.mimeType);
  const setImageUrl = useCollectionImageUrlStore((state) => state.setUrl);
  const setImageMimeType = useCollectionImageUrlStore((state) => state.setMimeType);

  const metadataUrl = useCollectionMetadataUrlStore((state) => state.url);
  const setMetadataUrl = useCollectionMetadataUrlStore((state) => state.setUrl);

  const transactionInProgress = useTransactionStateStore(
    (state) => state.transactionInProgress
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateCollection = async () => {
    setErrorMessage(""); // Clear any previous errors

    const { collectionName, metadataUrl } = formData;

    if (!collectionName || !metadataUrl) {
      setErrorMessage("Collection name and metadata URL are required.");
      return;
    }

    try {
      await createCollection(collectionName, formData.collectionSymbol, metadataUrl);

      // Reset form fields
      setFormData({
        address: "",
        imageUrl: "",
        imageMimeType: "",
        metadataUrl: "",
        collectionName: "",
        collectionSymbol: "",
      });
    } catch (error) {
      console.error("Error creating collection:", error);
      setErrorMessage("Failed to create collection. Please try again.");
    }
  };

  const validMimeTypes = ["image/png", "image/jpeg", "image/gif"];

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h3 className="pb-4 text-xl font-semibold">cNFT Collection</h3>

      <div className="grid w-full gap-6 rounded-md bg-white p-6 shadow-md">
        <div className="mb-4">
          <div className="text-gray-700 mb-2">Address: {address?.toString()}</div>
          <div className="text-gray-700 mb-2">Image URL: {imageUrl}</div>
          <div className="text-gray-700 mb-2">Image MIME Type: {imageMimeType}</div>
          <div className="text-gray-700 mb-2">Metadata URL: {metadataUrl}</div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <button
              type="button"
              className="btn btn-md btn-black"
              disabled={transactionInProgress || !formData.address}
              onClick={() => {
                setAddress(publicKey(formData.address));
                setFormData((prev) => ({ ...prev, address: "" }));
              }}
            >
              Set Address
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <input
              type="text"
              name="imageMimeType"
              placeholder="MIME Type"
              value={formData.imageMimeType}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <button
              type="button"
              className="btn btn-md btn-black"
              disabled={
                transactionInProgress ||
                !formData.imageMimeType ||
                !formData.imageUrl ||
                !validMimeTypes.includes(formData.imageMimeType)
              }
              onClick={() => {
                if (!validMimeTypes.includes(formData.imageMimeType)) {
                  setErrorMessage("Invalid MIME type. Use PNG, JPEG, or GIF.");
                  return;
                }

                setImageUrl(formData.imageUrl);
                setImageMimeType(formData.imageMimeType);
                setFormData((prev) => ({
                  ...prev,
                  imageUrl: "",
                  imageMimeType: "",
                }));
              }}
            >
              Set Image Data
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="metadataUrl"
              placeholder="Metadata URL"
              value={formData.metadataUrl}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <button
              type="button"
              className="btn btn-md btn-black"
              disabled={transactionInProgress || !formData.metadataUrl}
              onClick={() => {
                setMetadataUrl(formData.metadataUrl);
                setFormData((prev) => ({ ...prev, metadataUrl: "" }));
              }}
            >
              Set Metadata URL
            </button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              name="collectionName"
              placeholder="Name"
              value={formData.collectionName}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <input
              type="text"
              name="collectionSymbol"
              placeholder="Symbol"
              value={formData.collectionSymbol}
              onChange={handleChange}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
            />
            <button
              type="button"
              className="btn btn-md btn-black"
              disabled={transactionInProgress || !formData.metadataUrl || !formData.collectionName}
              onClick={handleCreateCollection}
            >
              Create Collection
            </button>
          </div>
        </div>

        {/* Error message display */}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <div className="space-y-4 mt-4">
          <ImageUploader type="collection" />
          <MetadataUploader type="collection" />
        </div>
      </div>
    </div>
  );
}
