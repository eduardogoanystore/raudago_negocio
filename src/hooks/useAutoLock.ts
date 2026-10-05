'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

function getAccountIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('business_account_id='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

export function useAutoLock() {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const accountId = getAccountIdFromCookie();
        if (accountId) {
          router.push(`/login-nip?id=${encodeURIComponent(accountId)}`);
        } else {
          router.push('/login');
        }
      }, INACTIVITY_MS);
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'] as const;

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // start the initial timer

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [router]);
}
