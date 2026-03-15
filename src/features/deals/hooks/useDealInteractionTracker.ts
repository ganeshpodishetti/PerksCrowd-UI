import { dealService } from '@/features/deals/services/dealService';
import type { FeedInteractionEventType } from '@/shared/types/api/requests';
import { useCallback } from 'react';

interface TrackInteractionParams {
  dealId: string;
  eventType: FeedInteractionEventType;
  userId?: string;
}

export const useDealInteractionTracker = () => {
  const trackInteraction = useCallback(async ({ dealId, eventType, userId }: TrackInteractionParams) => {
	try {
	  await dealService.trackFeedInteraction({ dealId, eventType, userId });
	} catch {
	  // Keep UI non-blocking if telemetry endpoint is temporarily unavailable.
	}
  }, []);

  const trackDealView = useCallback(
	async (dealId: string, userId?: string) => {
	  await trackInteraction({ dealId, eventType: 'View', userId });
	},
	[trackInteraction],
  );

  const trackDealClick = useCallback(
	async (dealId: string, userId?: string) => {
	  await trackInteraction({ dealId, eventType: 'Click', userId });
	},
	[trackInteraction],
  );

  const trackDealRedeem = useCallback(
	async (dealId: string, userId?: string) => {
	  await trackInteraction({ dealId, eventType: 'Redeem', userId });
	},
	[trackInteraction],
  );

  return {
	trackInteraction,
	trackDealView,
	trackDealClick,
	trackDealRedeem,
  };
};

