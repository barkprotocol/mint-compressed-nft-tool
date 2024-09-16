import { MerkleTree, TreeConfig } from "@metaplex-foundation/mpl-bubblegum";
import { PublicKey } from "@metaplex-foundation/umi";
import { create } from "zustand";

// Store for managing addresses
interface AddressStore {
  address: PublicKey | null;
  setAddress: (newAddress: PublicKey | null) => void;
}

// Store for managing Merkle Tree
interface MerkleTreeStore {
  merkleTree: MerkleTree | null;
  setMerkleTree: (newTree: MerkleTree | null) => void;
}

// Store for managing Merkle Tree configuration
interface MerkleTreeConfigStore {
  treeConfig: TreeConfig | null;
  setTreeConfig: (newConfig: TreeConfig | null) => void;
}

// Store for managing transaction state
interface TransactionStateStore {
  transactionInProgress: boolean;
  setTransactionInProgress: (inProgress: boolean) => void;
}

// Store for managing file URLs
interface FileUrlStore {
  url: string | null;
  setUrl: (newUrl: string | null) => void;
}

// Store for managing image files with URLs and mime types
interface ImageStore extends FileUrlStore {
  mimeType: string | null;
  setMimeType: (newMimeType: string | null) => void;
}

// Zustand stores
export const useMerkleTreeAddressStore = create<AddressStore>((set) => ({
  address: null,
  setAddress: (newAddress) => set(() => ({ address: newAddress })),
}));

export const useCollectionAddressStore = create<AddressStore>((set) => ({
  address: null,
  setAddress: (newAddress) => set(() => ({ address: newAddress })),
}));

export const useMerkleTreeStore = create<MerkleTreeStore>((set) => ({
  merkleTree: null,
  setMerkleTree: (newTree) => set(() => ({ merkleTree: newTree })),
}));

export const useMerkleTreeConfigStore = create<MerkleTreeConfigStore>((set) => ({
  treeConfig: null,
  setTreeConfig: (newConfig) => set(() => ({ treeConfig: newConfig })),
}));

export const useTransactionStateStore = create<TransactionStateStore>((set) => ({
  transactionInProgress: false,
  setTransactionInProgress: (inProgress) => set(() => ({ transactionInProgress: inProgress })),
}));

export const useCollectionImageUrlStore = create<ImageStore>((set) => ({
  url: null,
  mimeType: null,
  setUrl: (newUrl) => set(() => ({ url: newUrl })),
  setMimeType: (newMimeType) => set(() => ({ mimeType: newMimeType })),
}));

export const useCollectionMetadataUrlStore = create<FileUrlStore>((set) => ({
  url: null,
  setUrl: (newUrl) => set(() => ({ url: newUrl })),
}));

export const useNftImageUrlStore = create<ImageStore>((set) => ({
  url: null,
  mimeType: null,
  setUrl: (newUrl) => set(() => ({ url: newUrl })),
  setMimeType: (newMimeType) => set(() => ({ mimeType: newMimeType })),
}));

export const useNftMetadataUrlStore = create<FileUrlStore>((set) => ({
  url: null,
  setUrl: (newUrl) => set(() => ({ url: newUrl })),
}));
