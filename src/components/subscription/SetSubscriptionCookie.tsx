'use client';

import { useEffect } from 'react';
import { cacheSubscriptionStatus } from '@/actions/subscription';

export function SetSubscriptionCookie() {
  useEffect(() => {
    cacheSubscriptionStatus();
  }, []);

  return null;
}
