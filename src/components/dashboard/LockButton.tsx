'use client';

import { useRouter } from 'next/navigation';
import { useAutoLock } from '@/hooks/useAutoLock';

function getAccountIdFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('business_account_id='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function IconLock() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function LockButton() {
  useAutoLock();
  const router = useRouter();

  function handleLock() {
    const accountId = getAccountIdFromCookie();
    if (accountId) {
      router.push(`/login-nip?id=${encodeURIComponent(accountId)}`);
    } else {
      router.push('/login');
    }
  }

  return (
    <button
      onClick={handleLock}
      title="Bloquear sesion"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        height: 28,
        padding: '0 10px',
        background: 'transparent',
        border: '1px solid #3A3A42',
        borderRadius: 6,
        cursor: 'pointer',
        color: '#8E8B93',
        fontSize: 12,
        fontWeight: 500,
        flexShrink: 0,
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#6C47FF';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#8E8B93';
        (e.currentTarget as HTMLButtonElement).style.borderColor = '#3A3A42';
      }}
    >
      <IconLock />
      Bloquear
    </button>
  );
}
