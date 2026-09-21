'use client';

import { useTransition, useState } from 'react';
import { confirmTransferAction } from '@/actions/orders';

export function ConfirmTransferButton({
  orderId,
  negocio_slug,
}: {
  orderId: string;
  negocio_slug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await confirmTransferAction(orderId, negocio_slug);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending}
        style={{
          background: isPending ? 'var(--color-muted)' : '#F59E0B',
          color: 'white',
          padding: '0.4rem 0.85rem',
          borderRadius: '0.4rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {isPending ? 'Confirmando...' : 'Confirmar pago recibido'}
      </button>
      {error && (
        <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--color-alert)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
