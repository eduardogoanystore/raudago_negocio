'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlacesAutocomplete, PlaceResult } from '@/components/onboarding/PlacesAutocomplete';
import { createOrderAction, resolveMapsShortLinkAction, calcDrivingDistanceAction } from '@/actions/orders';

// ─── Parsea URLs de Google Maps a lat/lng ────────────────────────────────────
function parseMapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    const u = new URL(url);
    // ?q=lat,lng  o  ?q=nombre (no sirve)
    const q = u.searchParams.get('q');
    if (q) {
      const m = q.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    // /@lat,lng,zoom  o  /place/.../@lat,lng
    const at = u.pathname.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (at) return { lat: parseFloat(at[1]), lng: parseFloat(at[2]) };
    // ?ll=lat,lng
    const ll = u.searchParams.get('ll');
    if (ll) {
      const m = ll.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
      if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    return null;
  } catch {
    return null;
  }
}


async function geocodeLatLng(
  lat: number,
  lng: number,
  apiKey: string
): Promise<{ address: string } | { error: string }> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=es`
    );
    const data = await res.json();
    if (data.status === 'OK' && data.results[0]) {
      return { address: data.results[0].formatted_address as string };
    }
    return { error: data.status ?? 'UNKNOWN' };
  } catch {
    return { error: 'NETWORK_ERROR' };
  }
}

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
  originLat?: number | null;
  originLng?: number | null;
  branchId?: string | null;
}

function calcularTarifa(distanceKm: number, tiers: TariffTier[]): number | null {
  if (!distanceKm || distanceKm <= 0) return null;
  const tier = tiers.find(
    (t) => distanceKm >= t.min_km && (t.max_km === null || distanceKm < t.max_km)
  );
  if (!tier) return null;
  if (tier.extra_per_km !== null && tier.max_km === null) {
    return tier.price + Math.ceil(distanceKm - tier.min_km) * tier.extra_per_km;
  }
  return tier.price;
}

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

const DIVIDER_STYLE: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #F0EBE1',
  margin: '28px 0',
};

type ShippingPaidBy = 'client' | 'business' | 'split';
type PaymentMethod = 'cash' | 'transfer' | 'online';

const SHIPPING_PILLS: { value: ShippingPaidBy; label: string }[] = [
  { value: 'client', label: 'Cliente' },
  { value: 'business', label: 'Negocio' },
  { value: 'split', label: 'Split' },
];

const PAYMENT_PILLS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'online', label: 'Pago en línea' },
];

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '8px 18px',
    borderRadius: 999,
    border: active ? 'none' : '1px solid #DED7C9',
    background: active ? '#121214' : 'transparent',
    color: active ? '#ffffff' : '#57544f',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
  };
}

export function NuevoPedidoForm({ negocio_slug, tiers, originLat, originLng, branchId }: NuevoPedidoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [place, setPlace] = useState<PlaceResult | null>(null);
  const [shippingPaidBy, setShippingPaidBy] = useState<ShippingPaidBy>('client');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [distanceKm, setDistanceKm] = useState<string>('');
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Modo destino ──────────────────────────────────────────────────────────
  const [destinoMode, setDestinoMode] = useState<'address' | 'maps'>('address');
  const [mapsLink, setMapsLink] = useState('');
  const [mapsStatus, setMapsStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [mapsError, setMapsError] = useState('');

  async function handleMapsLink(value: string) {
    setMapsLink(value);
    setMapsStatus('idle');
    setMapsError('');
    setPlace(null);
    const trimmed = value.trim();
    if (!trimmed) return;

    setMapsStatus('loading');

    let urlToParse = trimmed;

    // Link corto → resolver server-side
    if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl')) {
      const result = await resolveMapsShortLinkAction(trimmed);
      if ('error' in result) {
        setMapsError('No se pudo resolver el link corto.');
        setMapsStatus('error');
        return;
      }
      urlToParse = result.resolvedUrl;
    }

    const coords = parseMapsUrl(urlToParse);
    if (!coords) {
      setMapsError('No se encontraron coordenadas en el link. Prueba con la URL completa de Google Maps.');
      setMapsStatus('error');
      return;
    }

    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      setMapsError('API key no configurada.');
      setMapsStatus('error');
      return;
    }

    const geocodeResult = await geocodeLatLng(coords.lat, coords.lng, key);
    if ('error' in geocodeResult) {
      if (geocodeResult.error === 'REQUEST_DENIED') {
        setMapsError('API key sin permisos para Geocoding. Activa la "Geocoding API" en Google Cloud Console.');
      } else {
        setMapsError(`No se pudo obtener la dirección (${geocodeResult.error}).`);
      }
      setMapsStatus('error');
      return;
    }

    setPlace({ address: geocodeResult.address, lat: coords.lat, lng: coords.lng, city: '' });
    setMapsStatus('ok');
  }

  useEffect(() => {
    if (!place?.lat || !place?.lng || !originLat || !originLng) return;
    setDistanceLoading(true);
    calcDrivingDistanceAction(originLat, originLng, place.lat, place.lng).then((result) => {
      if ('km' in result) setDistanceKm(String(result.km));
      setDistanceLoading(false);
    });
  }, [place, originLat, originLng]);

  const tarifa =
    distanceKm !== '' && !isNaN(parseFloat(distanceKm))
      ? calcularTarifa(parseFloat(distanceKm), tiers)
      : null;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handlePlaceSelect = useCallback((p: PlaceResult) => {
    setPlace(p);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        router.push(`/${negocio_slug}/`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPending, negocio_slug, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!place) {
      setError('Selecciona la dirección de entrega');
      return;
    }

    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set('recipient_address', place.address);
    if (place.lat !== null) formData.set('recipient_lat', String(place.lat));
    if (place.lng !== null) formData.set('recipient_lng', String(place.lng));
    if (branchId) formData.set('branch_id', branchId);

    startTransition(async () => {
      const result = await createOrderAction(negocio_slug, null, formData);
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else if (result.error) {
        setError(result.error);
      }
    });
  }

  const showMapPreview = place?.lat && place?.lng && apiKey;
  const staticMapUrl = showMapPreview
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${place.lat},${place.lng}&zoom=16&size=720x360&scale=2&markers=color:0x6C47FF|${place.lat},${place.lng}&key=${apiKey}`
    : null;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          #nuevo-pedido-layout { grid-template-columns: 1fr !important; }
          #nuevo-pedido-right { position: static !important; }
        }
      `}</style>

      <div
        id="nuevo-pedido-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* LEFT — Form */}
        <div>
          <form id="nuevo-pedido-form" onSubmit={handleSubmit}>
            {/* Section: Destino */}
            <section>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#57544f', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Destino
              </p>

              {/* Toggle de modo */}
              <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: '#F0EBE1', width: 'fit-content', marginBottom: 16 }}>
                {([
                  { value: 'address', label: 'Dirección' },
                  { value: 'maps', label: '📍 Link de Maps' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setDestinoMode(opt.value); setPlace(null); setMapsLink(''); setMapsStatus('idle'); setMapsError(''); }}
                    style={{
                      padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                      background: destinoMode === opt.value ? '#121214' : 'transparent',
                      color: destinoMode === opt.value ? '#C6FF3D' : '#57544f',
                      transition: 'all 150ms',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                {destinoMode === 'address' ? (
                  <>
                    <label style={LABEL_STYLE}>Dirección de entrega</label>
                    <PlacesAutocomplete
                      onSelect={handlePlaceSelect}
                      inputStyle={INPUT_STYLE}
                      placeholder="Calle y número, colonia, ciudad"
                    />
                  </>
                ) : (
                  <>
                    <label style={LABEL_STYLE}>
                      Link de ubicación de WhatsApp / Google Maps
                    </label>
                    <input
                      type="text"
                      value={mapsLink}
                      onChange={(e) => handleMapsLink(e.target.value)}
                      placeholder="Pega aquí el link que te mandó el cliente"
                      style={{
                        ...INPUT_STYLE,
                        borderColor: mapsStatus === 'error' ? '#FFCDD2' : mapsStatus === 'ok' ? '#C6FF3D' : '#DED7C9',
                      }}
                    />
                    {mapsStatus === 'error' && (
                      <p style={{ fontSize: 13, color: '#B00020', marginTop: 6 }}>{mapsError || 'No se pudo leer la ubicación.'}</p>
                    )}
                    {mapsStatus === 'ok' && place && (
                      <p style={{ fontSize: 13, color: '#166534', marginTop: 6 }}>✓ {place.address}</p>
                    )}
                  </>
                )}
              </div>
              <div>
                <label htmlFor="recipient_references" style={LABEL_STYLE}>
                  Referencias{' '}
                  <span style={{ fontWeight: 400, color: '#9B9590' }}>— opcional</span>
                </label>
                <input
                  id="recipient_references"
                  name="recipient_references"
                  type="text"
                  placeholder="Ej. Edificio azul, portón negro"
                  style={INPUT_STYLE}
                />
              </div>
            </section>

            <hr style={DIVIDER_STYLE} />

            {/* Section: Cliente */}
            <section>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#57544f', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Cliente
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label htmlFor="recipient_name" style={LABEL_STYLE}>
                    Nombre
                  </label>
                  <input
                    id="recipient_name"
                    name="recipient_name"
                    type="text"
                    required
                    placeholder="Nombre completo"
                    autoCapitalize="words"
                    onChange={(e) => {
                      const v = e.target.value;
                      e.target.value = v.replace(/\b\w/g, (c) => c.toUpperCase());
                    }}
                    style={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label htmlFor="recipient_phone" style={LABEL_STYLE}>
                    Teléfono
                  </label>
                  <input
                    id="recipient_phone"
                    name="recipient_phone"
                    type="tel"
                    required
                    placeholder="667 000 0000"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="\d{10}"
                    title="Ingresa los 10 dígitos del teléfono sin espacios ni guiones"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    }}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>
            </section>

            <hr style={DIVIDER_STYLE} />

            {/* Section: Envío */}
            <section>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#57544f', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ¿Quién absorbe el envío?
              </p>
              <input type="hidden" name="shipping_paid_by" value={shippingPaidBy} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SHIPPING_PILLS.map((pill) => (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setShippingPaidBy(pill.value)}
                    style={pillStyle(shippingPaidBy === pill.value)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </section>

            <hr style={DIVIDER_STYLE} />

            {/* Section: Pago del producto */}
            <section>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#57544f', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Método de pago del producto
              </p>
              <input type="hidden" name="product_payment_method" value={paymentMethod} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                {PAYMENT_PILLS.map((pill) => (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setPaymentMethod(pill.value)}
                    style={pillStyle(paymentMethod === pill.value)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
              {(paymentMethod === 'cash' || paymentMethod === 'transfer') && (
                <div>
                  <label htmlFor="product_amount" style={LABEL_STYLE}>
                    Monto del producto (MXN){' '}
                    <span style={{ fontWeight: 400, color: '#9B9590' }}>— opcional</span>
                  </label>
                  <input
                    id="product_amount"
                    name="product_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={INPUT_STYLE}
                  />
                </div>
              )}
            </section>

            <hr style={DIVIDER_STYLE} />

            {/* Section: Notas */}
            <section>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#57544f', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Notas{' '}
                <span style={{ fontWeight: 400, color: '#9B9590', textTransform: 'none', letterSpacing: 0 }}>— opcional</span>
              </p>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Instrucciones especiales, cómo encontrar el lugar..."
                style={{
                  ...INPUT_STYLE,
                  height: 'auto',
                  padding: '12px 16px',
                  resize: 'vertical',
                  lineHeight: 1.5,
                }}
              />
            </section>

            {/* Error banner */}
            {error && (
              <div
                style={{
                  marginTop: 24,
                  background: '#FFF0F0',
                  border: '1px solid #FFCDD2',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: '#B00020',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            )}
          </form>
        </div>

        {/* RIGHT — Sticky panel */}
        <div
          id="nuevo-pedido-right"
          style={{ position: 'sticky', top: 24 }}
        >
          <div
            style={{
              background: '#FFFDFA',
              border: '1px solid #DED7C9',
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Map preview */}
            {staticMapUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={staticMapUrl}
                alt="Vista previa del mapa"
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 12,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  background: '#F0EBE1',
                  borderRadius: 12,
                  height: 180,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 13, color: '#9B9590', lineHeight: 1.5 }}>
                  Selecciona la dirección de entrega
                </span>
              </div>
            )}

            {/* Distance field */}
            <div>
              <label htmlFor="distance_km" style={LABEL_STYLE}>
                Distancia (km)
              </label>
              <input
                id="distance_km"
                name="distance_km"
                type="number"
                required
                min="0.1"
                step="0.1"
                placeholder={distanceLoading ? 'Calculando…' : 'ej. 3.5'}
                form="nuevo-pedido-form"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                disabled={distanceLoading}
                style={{ ...INPUT_STYLE, opacity: distanceLoading ? 0.6 : 1 }}
              />
              {originLat && originLng && place && !distanceLoading && distanceKm && (
                <p style={{ fontSize: 12, color: '#57544f', marginTop: 4 }}>
                  Ruta calculada · puedes ajustarlo manualmente
                </p>
              )}
              {!originLat && (
                <p style={{ fontSize: 12, color: '#9B9590', marginTop: 4 }}>
                  Agrega coordenadas a tu sucursal para cálculo automático
                </p>
              )}
            </div>

            {/* Fare preview */}
            <div>
              <p style={{ fontSize: 13, color: '#57544f', margin: '0 0 4px' }}>
                Tarifa estimada
              </p>
              <p
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: tarifa !== null ? '#121214' : '#9B9590',
                  margin: 0,
                  fontFamily: 'var(--font-poppins), system-ui',
                  lineHeight: 1.1,
                }}
              >
                {tarifa !== null ? `$${tarifa.toLocaleString('es-MX')} MXN` : '—'}
              </p>
              <p style={{ fontSize: 12, color: '#9B9590', margin: '4px 0 0' }}>
                IVA incluido
              </p>
            </div>

            {/* CTA */}
            <button
              type="submit"
              form="nuevo-pedido-form"
              disabled={isPending}
              style={{
                height: 52,
                borderRadius: 999,
                background: '#6C47FF',
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
                width: '100%',
                fontFamily: 'inherit',
              }}
            >
              {isPending ? 'Publicando...' : 'Publicar pedido →'}
            </button>

            {/* Keyboard hint */}
            <p style={{ fontSize: 12, color: '#9B9590', textAlign: 'center', margin: 0 }}>
              ↵ Enter para publicar · Esc para salir
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
