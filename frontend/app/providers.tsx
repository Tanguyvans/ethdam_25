'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
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