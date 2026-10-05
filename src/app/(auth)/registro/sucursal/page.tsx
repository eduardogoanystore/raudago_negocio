'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { PlacesAutocomplete, type PlaceResult } from '@/components/onboarding/PlacesAutocomplete';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get('plan') ?? '';
  const interval = searchParams.get('interval') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [place, setPlace] = useState<PlaceResult | null>(null);

  const handlePlaceSelect = useCallback((p: PlaceResult) => setPlace(p), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!place?.address) {
      setError('Selecciona una dirección del listado de sugerencias.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set('address', place.address);
    formData.set('lat', place.lat?.toString() ?? '');
    formData.set('lng', place.lng?.toString() ?? '');
    formData.set('city', place.city);

    setError(null);
    startTransition(async () => {
      const result = await registerNegocioStep2Action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectTo) {
        router.push(result.redirectTo);
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
          title="¿Desde dónde salen tus pedidos?"
          subtitle="Con esta dirección calculamos los km y la tarifa de cada pedido."
        />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {planKey && <input type="hidden" name="_plan" value={planKey} />}
          {interval && <input type="hidden" name="_interval" value={interval} />}

          {/* Dirección con Google Places */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={LABEL_STYLE}>Dirección de recolección</label>
            <PlacesAutocomplete
              onSelect={handlePlaceSelect}
              inputStyle={INPUT_STYLE}
            />
          </div>

          {/* Referencia */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="referencia" style={LABEL_STYLE}>
              Referencia para el repartidor{' '}
              <span style={{ fontWeight: 400, color: '#8E8B93' }}>(opcional)</span>
            </label>
            <input
              id="referencia"
              name="referencia"
              type="text"
              placeholder="Ej. Entrada lateral, junto al estacionamiento"
              onChange={(e) => {
                const v = e.target.value;
                if (v.length === 1) e.target.value = v.toUpperCase();
              }}
              style={INPUT_STYLE}
            />
          </div>

          {/* Teléfono de sucursal */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="phone" style={LABEL_STYLE}>
              Teléfono de la sucursal{' '}
              <span style={{ fontWeight: 400, color: '#8E8B93' }}>(opcional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="667 000 0000"
              inputMode="numeric"
              maxLength={10}
              pattern="\d{10}"
              title="Ingresa los 10 dígitos de tu teléfono sin espacios ni guiones"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
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
            {isPending ? 'Guardando...' : 'Continuar →'}
          </button>

          <p style={{ fontSize: 13, color: '#8E8B93', margin: 0, textAlign: 'center' }}>
            Agrega más sucursales después desde el portal (plan Pro).
          </p>
        </form>
      </div>
    </main>
  );
}
