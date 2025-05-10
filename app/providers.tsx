'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={'cmaeh94f4004dl40mikstuvnr'}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}