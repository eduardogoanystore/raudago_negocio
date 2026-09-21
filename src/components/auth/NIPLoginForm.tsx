'use client';

import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginWithPIN } from '@/actions/pin';

export function NIPLoginForm() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get('id') ?? '';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  function handleDigit(d: string) {
    if (d === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    if (newPin.length === 4) {
      startTransition(async () => {
        setError('');
        const result = await loginWithPIN(accountId, newPin);
        if (result?.error) {
          setError(result.error);
          setPin('');
        }
      });
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem',
      padding: '3rem 1rem',
      minHeight: '100vh',
      background: 'var(--color-background)',
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
        Rauda<span style={{ color: 'var(--color-foreground)' }}>Go</span>
      </div>

      <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Ingresa tu NIP</h1>

      {/* Digit indicators */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: i < pin.length ? 'var(--color-primary)' : 'var(--color-border)',
            transition: 'background 0.15s',
          }} />
        ))}
      </div>

      {error && (
        <p style={{ color: 'var(--color-alert)', fontSize: '0.9rem', textAlign: 'center' }}>
          {error}
        </p>
      )}

      {isPending && (
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Verificando...</p>
      )}

      {/* Keypad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        maxWidth: '240px',
        width: '100%',
      }}>
        {digits.map((d, i) =>
          d === '' ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() => handleDigit(d)}
              disabled={isPending}
              style={{
                padding: '1rem',
                fontSize: '1.25rem',
                fontWeight: 600,
                borderRadius: '0.75rem',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                cursor: isPending ? 'not-allowed' : 'pointer',
                aspectRatio: '1',
                opacity: isPending ? 0.6 : 1,
              }}
            >
              {d}
            </button>
          )
        )}
      </div>

      <a
        href="/negocio/login"
        style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}
      >
        Usar contrasena en su lugar
      </a>
    </div>
  );
}
