'use client';

import { useTransition } from 'react';
import { logoutBusinessAction } from '@/actions/auth';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
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
