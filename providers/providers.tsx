'use client';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

type Props = {
  children: React.ReactNode;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

const Providers = ({ children }: Props) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
