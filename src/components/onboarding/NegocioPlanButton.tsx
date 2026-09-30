'use client';

import { useState, useTransition } from 'react';
import { createNegocioCheckoutAction } from '@/actions/onboarding';

interface NegocioPlanButtonProps {
  planId: string;
  interval: 'WEEK' | 'MONTH' | 'YEAR';
  label?: string;
}

export function NegocioPlanButton({ planId, interval, label = 'Seleccionar plan' }: NegocioPlanButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createNegocioCheckoutAction(planId, interval);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        onClick={handleClick}
        disabled={isPending}
        style={{
          height: 48,
          borderRadius: 12,
          background: isPending ? '#A08EFF' : '#6C47FF',
          border: 'none',
          color: '#ffffff',
          fontSize: 15,
          fontWeight: 700,
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          width: '100%',
          transition: 'background 0.15s',
        }}
      >
        {isPending ? 'Redirigiendo...' : label}
      </button>
      {error && (
        <p style={{ fontSize: 13, color: '#B00020', margin: 0, textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
}
