'use client';

import { useState, useTransition } from 'react';
import { elevateWithPINAction } from '@/actions/elevation';

interface Props {
  open: boolean;
  action: string;
  requestedBy: string;
  onAuthorized: () => void;
  onClose: () => void;
}

const PIN_LENGTH = 4;
const KEYPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function ElevationModal({ open, action, requestedBy, onAuthorized, onClose }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  const handleDigit = (digit: string) => {
    if (isPending) return;
    if (pin.length >= PIN_LENGTH) return;

    const newPin = pin + digit;
    setPin(newPin);
    setError(null);

    if (newPin.length === PIN_LENGTH) {
      startTransition(async () => {
        const result = await elevateWithPINAction(newPin, action);
        if (result.success) {
          setPin('');
          onAuthorized();
        } else {
          setPin('');
          setError(result.error ?? 'PIN incorrecto');
        }
      });
    }
  };

  const handleDelete = () => {
    if (isPending) return;
    setPin((p) => p.slice(0, -1));
    setError(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>
          Requiere autorización
        </h2>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)' }}>
            Acción: {action}
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-muted)' }}>
            Solicitado por: {requestedBy}
          </p>
        </div>

        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Ingresa el NIP de un encargado o dueño
        </p>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: i < pin.length ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'background 0.15s',
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#DC2626', fontWeight: 500 }}>
            {error}
          </p>
        )}

        {isPending && (
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Verificando...
          </p>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            width: '100%',
          }}
        >
          {KEYPAD_KEYS.map((key, i) => (
            <button
              key={i}
              onClick={() => {
                if (key === '⌫') handleDelete();
                else if (key) handleDigit(key);
              }}
              disabled={isPending || key === ''}
              style={{
                aspectRatio: '1',
                borderRadius: '0.75rem',
                border: key === '' ? 'none' : '1px solid var(--color-border)',
                background: key === '' ? 'transparent' : 'var(--color-surface)',
                fontSize: '1.25rem',
                fontWeight: 600,
                cursor: key === '' ? 'default' : 'pointer',
                visibility: key === '' ? 'hidden' : 'visible',
                opacity: isPending ? 0.5 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={isPending}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-muted)',
            fontSize: '0.9rem',
            cursor: isPending ? 'not-allowed' : 'pointer',
            padding: '0.25rem 0.5rem',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
