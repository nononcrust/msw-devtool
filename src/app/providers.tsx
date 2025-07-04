'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { DevOnlyMSWProvider } from '@/mocks/components/msw-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  return (
    <DevOnlyMSWProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DevOnlyMSWProvider>
  );
};
