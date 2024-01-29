import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_REQUIRED_SNAP_ID: string;
    readonly NEXT_PUBLIC_REQUIRED_SNAP_VERSION: string;
  }
}
