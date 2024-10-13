import '@solana/wallet-adapter-react-ui/styles.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

import { WalletConnectProvider } from '@/components';

import '../styles/global.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Todo App</title>
      </Head>
      <main>
        <WalletConnectProvider>
          <Component {...pageProps} />
        </WalletConnectProvider>

        <Toaster position="bottom-left" />
      </main>
    </>
  );
}

export default App;
