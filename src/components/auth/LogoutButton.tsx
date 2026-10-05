'use client';

import { useTransition } from 'react';
import { logoutBusinessAction } from '@/actions/auth';

export function LogoutButton({ compact }: { compact?: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (compact) {
    return (
      <button
        onClick={() => startTransition(() => logoutBusinessAction())}
        disabled={isPending}
        title="Cerrar sesion"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          background: 'transparent',
          border: 'none',
          borderRadius: 6,
          cursor: isPending ? 'not-allowed' : 'pointer',
          color: isPending ? '#555' : '#8E8B93',
          flexShrink: 0,
          transition: 'color 0.15s',
          padding: 0,
        }}
      >
        {/* Log-out icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={() => startTransition(() => logoutBusinessAction())}
      disabled={isPending}
      style={{
        padding: '0.5rem 1rem',
        background: 'transparent',
        color: isPending ? 'var(--color-muted)' : 'rgba(255,255,255,0.75)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        cursor: isPending ? 'not-allowed' : 'pointer',
      }}
    >
      {isPending ? 'Saliendo...' : 'Cerrar sesion'}
    </button>
  );
}
