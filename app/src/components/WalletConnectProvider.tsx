import { useMemo, ReactNode } from 'react';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, AlphaWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

export type WalletConnectProviderProps = {
  children: ReactNode;
};

export const WalletConnectProvider = ({ children }: WalletConnectProviderProps): JSX.Element => {
  const endpoint = clusterApiUrl('devnet');
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new TrustWalletAdapter(), new AlphaWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
