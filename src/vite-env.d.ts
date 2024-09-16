/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_URL: string;
  readonly VITE_SOL_CLUSTER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
