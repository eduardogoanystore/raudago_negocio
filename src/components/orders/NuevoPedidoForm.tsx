'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { createOrderAction } from '@/actions/orders';

export interface TariffTier {
  id: string;
  min_km: number;
  max_km: number | null;
  price: number;
  extra_per_km: number | null;
}

interface NuevoPedidoFormProps {
  negocio_slug: string;
  tiers: TariffTier[];
}

function calcularTarifa(distanceKm: number, tiers: TariffTier[]): number | null {
  if (!distanceKm || distanceKm <= 0) return null;
  const tier = tiers.find(
    (t) => distanceKm >= t.min_km && (t.max_km === null || distanceKm < t.max_km)
  );
  if (!tier) return null;
  if (tier.extra_per_km !== null && tier.max_km === null) {
    // Tramo abierto: precio base + ceil(km extra) * extra_per_km
    return tier.price + Math.ceil(distanceKm - tier.min_km) * tier.extra_per_km;
  }
  return tier.price;
}

export function NuevoPedidoForm({ negocio_slug, tiers }: NuevoPedidoFormProps) {
  const [state, formAction, isPending] = useActionState(
    createOrderAction.bind(null, negocio_slug),
    null
  );

  const [distanceKm, setDistanceKm] = useState<string>('');

  const tarifa =
    distanceKm !== '' && !isNaN(parseFloat(distanceKm))
      ? calcularTarifa(parseFloat(distanceKm), tiers)
      : null;

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '0.35rem',
    color: 'var(--color-foreground)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.6rem 0.75rem',
    border: '1px solid var(--color-border)',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    background: 'white',
    color: 'var(--color-foreground)',
    outline: 'none',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
  };

  return (
    <form action={formAction}>
      {/* Sección 1 — Destinatario */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'var(--color-foreground)',
          }}
        >
          Datos del destinatario
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}
        >
          <div>
            <label htmlFor="recipient_name" style={labelStyle}>
              Nombre
            </label>
            <input
              id="recipient_name"
              name="recipient_name"
              type="text"
              required
              placeholder="Nombre completo"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="recipient_phone" style={labelStyle}>
              Teléfono
            </label>
            <input
              id="recipient_phone"
              name="recipient_phone"
              type="tel"
              required
              placeholder="667 000 0000"
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="recipient_address" style={labelStyle}>
            Dirección de entrega
          </label>
          <input
            id="recipient_address"
            name="recipient_address"
            type="text"
            required
            placeholder="Calle, número, colonia"
            style={inputStyle}
          />
        </div>
      </section>

      {/* Sección 2 — Pedido */}
      <section style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'var(--color-foreground)',
          }}
        >
          Detalles del pedido
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <label htmlFor="distance_km" style={labelStyle}>
              Distancia (km)
            </label>
            <input
              id="distance_km"
              name="distance_km"
              type="number"
              required
              min="0.1"
              step="0.1"
              placeholder="ej. 3.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="product_payment_method" style={labelStyle}>
              Método de pago del producto
            </label>
            <select
              id="product_payment_method"
              name="product_payment_method"
              defaultValue="cash"
              style={selectStyle}
            >
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <label htmlFor="product_amount" style={labelStyle}>
              Monto del producto (MXN)
              <span
                style={{
                  fontWeight: 400,
                  color: 'var(--color-muted)',
                  marginLeft: '0.35rem',
                }}
              >
                — opcional
              </span>
            </label>
            <input
              id="product_amount"
              name="product_amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="shipping_paid_by" style={labelStyle}>
              Envio pagado por
            </label>
            <select
              id="shipping_paid_by"
              name="shipping_paid_by"
              defaultValue="client"
              style={selectStyle}
            >
              <option value="client">Cliente</option>
              <option value="business">Negocio</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="notes" style={labelStyle}>
            Notas
            <span
              style={{
                fontWeight: 400,
                color: 'var(--color-muted)',
                marginLeft: '0.35rem',
              }}
            >
              — opcional
            </span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Instrucciones especiales de entrega, referencias, etc."
            style={{
              ...inputStyle,
              resize: 'vertical',
              lineHeight: '1.5',
            }}
          />
        </div>
      </section>

      {/* Sección 3 — Vista previa de tarifa */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-muted)',
            marginBottom: '0.35rem',
          }}
        >
          Tarifa de envio estimada
        </p>
        <p
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
          }}
        >
          {tarifa !== null ? `$${tarifa.toFixed(2)} MXN` : '—'}
        </p>
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-muted)',
            marginTop: '0.25rem',
          }}
        >
          Esta tarifa es informativa. El cobro se realiza por suscripcion semanal.
        </p>
      </div>

      {/* Error display */}
      {state?.error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid var(--color-alert)',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            color: 'var(--color-alert)',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Botón submit */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          background: isPending ? 'var(--color-muted)' : 'var(--color-primary)',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          border: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {isPending ? 'Creando pedido...' : 'Crear pedido'}
      </button>
    </form>
  );
}
