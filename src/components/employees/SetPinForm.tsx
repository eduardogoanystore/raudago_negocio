'use client';

import { useActionState } from 'react';
import { setPinAction } from '@/actions/employees';

export function SetPinForm() {
  const [state, formAction, isPending] = useActionState(setPinAction, null);

  return (
    <form action={formAction}>
      {state?.success && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#15803D',
        }}>
          PIN configurado correctamente.
        </div>
      )}
      {state?.error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.875rem',
          color: '#B91C1C',
        }}>
          {state.error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          Contrasena actual
        </label>
        <input
          type="password"
          name="current_password"
          required
          style={{
            width: '100%',
            padding: '0.65rem 0.9rem',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          Nuevo PIN (4 digitos)
        </label>
        <input
          type="password"
          name="pin"
          required
          maxLength={4}
          pattern="\d{4}"
          inputMode="numeric"
          placeholder="••••"
          style={{
            width: '100%',
            padding: '0.65rem 0.9rem',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            letterSpacing: '0.4em',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: '0.65rem 1.5rem',
          background: isPending ? 'var(--color-border)' : 'var(--color-primary)',
          color: isPending ? 'var(--color-muted)' : 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? 'Guardando...' : 'Guardar PIN'}
      </button>
    </form>
  );
}
