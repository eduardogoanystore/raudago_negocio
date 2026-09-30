'use client';

import { useEffect } from 'react';
import { cacheSubscriptionStatus } from '@/actions/subscription';

interface Props {
  businessId: string;
  status: string;
}

export function SetSubscriptionCookie({ businessId, status }: Props) {
  useEffect(() => {
    if (businessId && status) {
      cacheSubscriptionStatus(businessId, status);
    }
  }, [businessId, status]);

  return null;
}
