import { UnreadDealsContext, UnreadDealsContextType } from '@/features/deals/contexts/UnreadDealsContext';
import { ensureClientContext } from '@/shared/utils/runtimeSafety';
import { useContext } from 'react';

const fallbackUnreadDealsContext: UnreadDealsContextType = {
  unreadCount: 0,
  isLoading: false,
  refreshCount: async () => undefined,
  updateCount: () => undefined,
};

// Custom hook to use the context
export const useUnreadDealsCount = (): UnreadDealsContextType => {
  return ensureClientContext(
    useContext(UnreadDealsContext),
    fallbackUnreadDealsContext,
    'useUnreadDealsCount must be used within an UnreadDealsProvider',
  );
};

// Re-export provider for convenience
// Re-export the provider for convenience
export { UnreadDealsProvider } from '@/features/deals/contexts/UnreadDealsContext';

// Legacy support - can be removed once all components are updated
export const updateUnreadCount = (_newCount: number) => {
  // Deprecated: Use the context updateCount method instead.
};
