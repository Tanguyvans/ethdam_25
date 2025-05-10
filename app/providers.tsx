'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { defineChain } from 'viem';

// Define the Sapphire testnet chain
const sapphireTestnet = defineChain({
  id: 23295,
  name: 'Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ROSE',
    symbol: 'ROSE'
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev']
    }
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Explorer',
      url: 'https://testnet.explorer.sapphire.oasis.dev'
    }
  }
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6',
        },
        // Chain configuration using the defined chain
        defaultChain: sapphireTestnet,
        supportedChains: [sapphireTestnet],
        // Configure embedded wallet creation
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets', // Create wallet for users who don't have one
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}