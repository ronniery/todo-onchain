import Head from 'next/head';
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
      </main>
    </>
  );
}

export default App;
