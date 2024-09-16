import { useCallback, useMemo } from "react";
import {
  createTree,
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
  mintToCollectionV1,
} from "@metaplex-foundation/mpl-bubblegum";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  PublicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { toast } from "react-toastify";
import useUmi from "./useUmi";
import {
  useCollectionAddressStore,
  useMerkleTreeAddressStore,
  useMerkleTreeConfigStore,
  useMerkleTreeStore,
  useTransactionStateStore,
} from "../store/minterStore";
import { NftMetadata } from "../utils/types";

export default function useMinter() {
  const { umi } = useUmi();

  const merkleTreeAddress = useMerkleTreeAddressStore((state) => state.address);
  const setAddress = useMerkleTreeAddressStore((state) => state.setAddress);
  const setMerkleTree = useMerkleTreeStore((state) => state.setMekleTree);
  const setTreeConfig = useMerkleTreeConfigStore(
    (state) => state.setTreeConfig,
  );

  const collectionAddress = useCollectionAddressStore((state) => state.address);
  const setCollectionAddress = useCollectionAddressStore(
    (state) => state.setAddress,
  );

  const setTransactionInProgress = useTransactionStateStore(
    (state) => state.setTransactionInProgress,
  );

  const createMerkleTree = useCallback(
    async (maxDepth: number, maxBufferSize: number, canopyDepth: number) => {
      setTransactionInProgress(true);

      if (!umi) {
        toast.error("Umi not initialized");
        setTransactionInProgress(false);

        return;
      }

      const merkleTree = generateSigner(umi);

      const builder = await createTree(umi, {
        merkleTree,
        maxDepth: maxDepth,
        maxBufferSize: maxBufferSize,
        canopyDepth: canopyDepth,
      });

      try {
        const tx = await builder.sendAndConfirm(umi, {
          confirm: {
            commitment: "confirmed",
          },
          send: {
            commitment: "confirmed",
            maxRetries: 3,
          },
        });

        setAddress(merkleTree.publicKey);

        toast.success(
          `Transaction hash: ${base58.deserialize(tx.signature)[0]}`,
        );
      } catch (error) {
        toast.error("An error occured while creating merkle tree");
        console.error(error);
      }

      setTransactionInProgress(false);
    },
    [setAddress, setTransactionInProgress, umi],
  );

  const fetchTree = useCallback(async () => {
    setTransactionInProgress(true);

    if (!umi) {
      toast.error("Umi not initialized");
      setTransactionInProgress(false);

      return;
    }

    if (!merkleTreeAddress) {
      toast.error("No address provided");
      setTransactionInProgress(false);

      return;
    }

    try {
      const merkleTree = await fetchMerkleTree(umi, merkleTreeAddress, {
        commitment: "confirmed",
      });

      setMerkleTree(merkleTree);
    } catch (error) {
      console.error(error);
      toast.error("An error occured while fetching merkle tree");
    }

    setTransactionInProgress(false);
  }, [merkleTreeAddress, setMerkleTree, setTransactionInProgress, umi]);

  const fetchTreeConfig = useCallback(async () => {
    setTransactionInProgress(true);

    if (!umi) {
      toast.error("Umi not initialized");
      setTransactionInProgress(false);

      return;
    }

    if (!merkleTreeAddress) {
      toast.error("No address provided");
      setTransactionInProgress(false);

      return;
    }

    try {
      const treeConfig = await fetchTreeConfigFromSeeds(
        umi,
        {
          merkleTree: merkleTreeAddress,
        },
        { commitment: "confirmed" },
      );

      setTreeConfig(treeConfig);
    } catch (error) {
      console.error(error);
      toast.error("An error occured while fetching merkle tree config");
    }

    setTransactionInProgress(false);
  }, [merkleTreeAddress, setTransactionInProgress, setTreeConfig, umi]);

  const uploadImage = useCallback(
    async (
      content: string | Uint8Array,
      fileName: string,
      mimeType: string,
    ) => {
      if (!umi) {
        toast.error("Umi not initialized");
        setTransactionInProgress(false);

        return;
      }

      try {
        const genericUmiFile = createGenericFile(content, fileName, {
          tags: [{ name: "Content-Type", value: mimeType }],
        });

        const imageUri = await umi.uploader.upload([genericUmiFile]);

        return imageUri[0];
      } catch (error) {
        toast.error(`An error occured while uploading image: ${error}`);

        return null;
      }
    },
    [setTransactionInProgress, umi],
  );

  const uploadMetadata = useCallback(
    async (metadata: NftMetadata) => {
      if (!umi) {
        toast.error("Umi not initialized");
        setTransactionInProgress(false);

        return;
      }

      try {
        return await umi.uploader.uploadJson(metadata);
      } catch (error) {
        toast.error(`An error occured while uploading metadata: ${error}`);

        return null;
      }
    },
    [setTransactionInProgress, umi],
  );

  const createCollection = useCallback(
    async (
      collectionName: string,
      collectionSymbol: string,
      metadataUri: string,
    ) => {
      setTransactionInProgress(true);

      if (!umi) {
        toast.error("Umi not initialized");
        setTransactionInProgress(false);

        return;
      }

      const collectionMint = generateSigner(umi);

      try {
        const tx = await createNft(umi, {
          mint: collectionMint,
          name: collectionName,
          isMutable: true,
          symbol: collectionSymbol,
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(100),
          isCollection: true,
        }).sendAndConfirm(umi, {
          confirm: {
            commitment: "confirmed",
          },
          send: {
            commitment: "confirmed",
            maxRetries: 3,
          },
        });

        toast.success(
          `Transaction hash: ${base58.deserialize(tx.signature)[0]}`,
        );

        setCollectionAddress(collectionMint.publicKey);
      } catch (error) {
        console.error(error);
        toast.error("An error occured when creating collection");
      }

      setTransactionInProgress(false);
    },
    [setCollectionAddress, setTransactionInProgress, umi],
  );

  const mintToCollection = useCallback(
    async (
      name: string,
      symbol: string,
      metadataUrl: string,
      addresses: PublicKey[],
    ) => {
      setTransactionInProgress(true);

      if (!umi) {
        toast.error("Umi not initialized");
        setTransactionInProgress(false);

        return;
      }

      if (!merkleTreeAddress || !collectionAddress) {
        setTransactionInProgress(false);
        return;
      }

      try {
        let builder = transactionBuilder();

        for (const address of addresses) {
          const txBuilder = mintToCollectionV1(umi, {
            leafOwner: address,
            merkleTree: merkleTreeAddress,
            collectionMint: collectionAddress,
            metadata: {
              name: name,
              symbol: symbol,
              uri: metadataUrl,
              sellerFeeBasisPoints: 10000,
              isMutable: true,
              collection: { key: collectionAddress, verified: true },
              creators: [
                {
                  address: umi.identity.publicKey,
                  verified: true,
                  share: 100,
                },
              ],
            },
          });

          builder = builder.add(txBuilder);
        }

        const tx = await builder.sendAndConfirm(umi, {
          confirm: {
            commitment: "confirmed",
          },
          send: {
            commitment: "confirmed",
            maxRetries: 3,
          },
        });

        toast.success(
          `Transaction hash: ${base58.deserialize(tx.signature)[0]}`,
        );
      } catch (error) {
        console.error(error);
        toast.error("An error occured when minting cNFTs");
      }

      setTransactionInProgress(false);
    },
    [collectionAddress, merkleTreeAddress, setTransactionInProgress, umi],
  );

  return useMemo(
    () => ({
      createMerkleTree,
      fetchTree,
      fetchTreeConfig,
      createCollection,
      mintToCollection,
      uploadImage,
      uploadMetadata,
    }),
    [
      createMerkleTree,
      fetchTree,
      fetchTreeConfig,
      createCollection,
      mintToCollection,
      uploadImage,
      uploadMetadata,
    ],
  );
}
