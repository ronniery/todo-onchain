import path from 'path';

/** @type {import('next').NextConfig} */
export default {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
    };
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      '@solana/wallet-adapter-react': path.resolve('./node_modules/@solana/wallet-adapter-react'),
    };
    return config;
  },

  env: {
    NEXT_PUBLIC_RPC_HOST: 'https://metaplex.devnet.rpcpool.com/',
    // NEXT_PUBLIC_RPC_HOST: 'https://api.metaplex.solana.com/',
  },
};
