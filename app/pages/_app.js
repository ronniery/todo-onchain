import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import '../styles/global.css';
import { WalletConnectProvider } from '../components/WalletConnectProvider';
import '@solana/wallet-adapter-react-ui/styles.css';

function App({ Component, pageProps }) {
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
