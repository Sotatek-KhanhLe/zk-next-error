import { MetaMaskInpageProvider } from '@metamask/providers';
import MinaProvider from '@aurowallet/mina-provider';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    mina?: MinaProvider;
  }
}
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NEXT_PUBLIC_REQUIRED_SNAP_ID: string;
    readonly NEXT_PUBLIC_REQUIRED_SNAP_VERSION: string;
  }
}
