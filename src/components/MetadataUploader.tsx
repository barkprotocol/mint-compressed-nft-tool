import { useState } from "react";
import useMinter from "../hooks/useMinter";
import { NftMetadata, Attribute } from "../utils/types"; // Ensure Attribute is defined in types
import {
  useCollectionMetadataUrlStore,
  useNftMetadataUrlStore,
  useTransactionStateStore,
} from "../store/minterStore";

const MetadataUploader = ({ type }: { type: "collection" | "nft" }) => {
  const { uploadMetadata } = useMinter();
  const [metadata, setMetadata] = useState<NftMetadata>({
    name: "",
    image: "",
    description: "",
    attributes: [],
    properties: {
      files: [{ uri: "", type: "" }],
      category: "image",
    },
    external_url: "",
  });
  const setCollectionUrl = useCollectionMetadataUrlStore((state) => state.setUrl);
  const setNftUrl = useNftMetadataUrlStore((state) => state.setUrl);
  const transactionInProgress = useTransactionStateStore((state) => state.transactionInProgress);

  const handleInputChange = (field: keyof NftMetadata, value: string) => {
    setMetadata((currentMetadata) => ({
      ...currentMetadata,
      [field]: value,
    }));
  };

  const handleAttributeChange = (index: number, field: keyof Attribute, value: string) => {
    setMetadata((currentMetadata) => {
      const newAttributes = [...currentMetadata.attributes];
      newAttributes[index] = {
        ...newAttributes[index],
        [field]: value,
      };
      return {
        ...currentMetadata,
        attributes: newAttributes,
      };
    });
  };

  const handleUpload = async () => {
    if (!metadata) return;

    const metadataUri = await uploadMetadata(metadata);

    if (!metadataUri) return;

    switch (type) {
      case "collection":
        setCollectionUrl(metadataUri);
        break;
      case "nft":
        setNftUrl(metadataUri);
        break;
    }

    setMetadata({
      name: "",
      image: "",
      description: "",
      attributes: [],
      properties: {
        files: [{ uri: "", type: "" }],
        category: "image",
      },
      external_url: "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="col-span-1 sm:col-span-2 font-bold text-lg">Metadata uploader</div>

      <input
        onChange={(e) => handleInputChange('name', e.target.value)}
        value={metadata.name}
        type="text"
        required
        placeholder="Name"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
      />

      <input
        onChange={(e) => handleInputChange('description', e.target.value)}
        value={metadata.description}
        type="text"
        required
        placeholder="Description"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
      />

      <input
        onChange={(e) => handleInputChange('image', e.target.value)}
        value={metadata.image}
        type="text"
        required
        placeholder="Image URL"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
      />

      <input
        onChange={(e) => handleInputChange('properties.files[0].type', e.target.value)}
        value={metadata.properties?.files[0].type || ''}
        type="text"
        required
        placeholder="Mime Type"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
      />

      <input
        onChange={(e) => handleInputChange('external_url', e.target.value)}
        value={metadata.external_url}
        type="text"
        placeholder="External URL"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:col-span-2 sm:text-sm"
      />

      <div className="col-span-1 sm:col-span-2 font-bold text-lg">Attributes</div>

      {metadata.attributes.map((attribute, i) => (
        <div key={i} className="col-span-1 sm:col-span-2 flex flex-row gap-3">
          <input
            onChange={(e) => handleAttributeChange(i, 'trait_type', e.target.value)}
            value={attribute.trait_type}
            type="text"
            required
            placeholder="Trait Type"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />
          <input
            onChange={(e) => handleAttributeChange(i, 'value', e.target.value)}
            value={attribute.value}
            type="text"
            required
            placeholder="Value"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 sm:text-sm"
          />
          <button
            type="button"
            className="btn btn-sm btn-white"
            disabled={transactionInProgress}
            onClick={() => setMetadata((currentMetadata) => ({
              ...currentMetadata,
              attributes: currentMetadata.attributes.filter((_, idx) => idx !== i),
            }))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      <div className="col-span-1 sm:col-span-2 flex flex-row gap-4 justify-center">
        <button
          type="button"
          className="btn btn-md btn-black"
          disabled={transactionInProgress}
          onClick={() => setMetadata((currentMetadata) => ({
            ...currentMetadata,
            attributes: [...currentMetadata.attributes, { trait_type: "", value: "" }],
          }))}
        >
          Add Attribute
        </button>
        <button
          type="button"
          className="btn btn-md btn-black"
          disabled={
            transactionInProgress ||
            !metadata.name ||
            !metadata.description ||
            !metadata.image ||
            !metadata.properties.files[0].type
          }
          onClick={handleUpload}
        >
          Upload Metadata
        </button>
      </div>
    </div>
  );
};

export default MetadataUploader;
