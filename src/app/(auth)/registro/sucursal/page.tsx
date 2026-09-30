'use client';

import { useState, useTransition } from 'react';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { registerNegocioStep2Action } from '@/actions/onboarding';

const INPUT_STYLE: React.CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: '1.5px solid #DED7C9',
  background: '#FFFDFA',
  padding: '0 16px',
  fontSize: 15,
  color: '#121214',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#121214',
  display: 'block',
  marginBottom: 8,
};

export default function RegistroSucursalPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setError(null);
    startTransition(async () => {
      const result = await registerNegocioStep2Action(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#FFFDFA',
          borderRadius: 24,
          border: '1px solid #DED7C9',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 520,
        }}
      >
        <OnboardingHeader
          step={2}
          title="Tu primera sucursal"
          subtitle="Desde aquí recibirán y despacharán los pedidos."
        />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Nombre de sucursal */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="branch_name" style={LABEL_STYLE}>
              Nombre de la sucursal
            </label>
            <input
              id="branch_name"
              name="branch_name"
              type="text"
              placeholder="Ej. Sucursal Centro"
              required
              style={INPUT_STYLE}
            />
          </div>

          {/* Dirección */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="address" style={LABEL_STYLE}>
              Dirección completa
            </label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Blvd. Culiacán 123, Col. Centro"
              required
              style={INPUT_STYLE}
            />
          </div>

          {/* Ciudad — read-only */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="city" style={LABEL_STYLE}>
              Ciudad
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value="Culiacán, Sinaloa"
              readOnly
              style={{
                ...INPUT_STYLE,
                background: '#F3EFE7',
                color: '#57544f',
                cursor: 'default',
              }}
            />
            <span style={{ fontSize: 12, color: '#8E8B93', marginTop: 6 }}>
              Por ahora solo operamos en Culiacán.
            </span>
          </div>

          {/* Teléfono de sucursal */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="phone" style={LABEL_STYLE}>
              Teléfono de la sucursal (opcional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="667 000 0000"
              style={INPUT_STYLE}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                background: '#FFF0F0',
                border: '1px solid #FFCDD2',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                color: '#B00020',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              height: 52,
              borderRadius: 14,
              background: isPending ? '#A08EFF' : '#6C47FF',
              border: 'none',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {isPending ? 'Guardando...' : 'Continuar \u2192'}
          </button>
        </form>
      </div>
    </main>
  );
}
