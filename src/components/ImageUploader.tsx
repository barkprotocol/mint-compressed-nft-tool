import { ChangeEvent, useState } from "react";
import useMinter from "../hooks/useMinter";
import {
  useCollectionImageUrlStore,
  useNftImageUrlStore,
  useTransactionStateStore,
} from "../store/minterStore";
import { toast } from "react-toastify";

export default function ImageUploader({
  type,
}: {
  type: "collection" | "nft";
}) {
  const { uploadImage } = useMinter();
  const [file, setFile] = useState<{
    fileName: string;
    fileContents: Uint8Array;
    mimeType: string;
  } | null>(null);

  const transactionInProgress = useTransactionStateStore(
    (state) => state.transactionInProgress,
  );

  const setCollectionUrl = useCollectionImageUrlStore((state) => state.setUrl);
  const setCollectionMimeType = useCollectionImageUrlStore(
    (state) => state.setMimeType,
  );
  const setNftUrl = useNftImageUrlStore((state) => state.setUrl);
  const setNftMimeType = useNftImageUrlStore((state) => state.setMimeType);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        setFile({
          fileContents: uint8Array,
          fileName: file.name,
          mimeType: file.type,
        });
      };
      reader.onerror = (error) => {
        toast.error("An error occurred while reading the file");
        console.error("Error reading file:", error);
        setFile(null);
      };
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    const imageUri = await uploadImage(
      file.fileContents,
      file.fileName,
      file.mimeType,
    );
    if (!imageUri) {
      return;
    }
    switch (type) {
      case "collection":
        setCollectionUrl(imageUri);
        setCollectionMimeType(file.mimeType);
        break;
      case "nft":
        setNftUrl(imageUri);
        setNftMimeType(file.mimeType);
        break;
    }
    setFile(null);
  };

  return (
    <div className="grid gap-3">
      <div>Image uploader</div>
      <input
        onChange={handleFileChange}
        type="file"
        placeholder="Image"
        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-gray-800 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
      />
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          className="btn btn-sm btn-black"
          disabled={transactionInProgress || !file}
          onClick={handleUpload}
        >
          Upload Image
        </button>
        <button
          type="button"
          className="btn btn-sm btn-white"
          disabled={transactionInProgress}
          onClick={() => setFile(null)}
        >
          Clear Image
        </button>
      </div>
    </div>
  );
}
