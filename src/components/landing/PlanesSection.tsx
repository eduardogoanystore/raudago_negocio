'use client';

import { useState } from 'react';

export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  priceWeeklyCents: number;
  priceMonthlyCents: number;
  priceAnnualCents: number;
  promoPriceCents: number | null;
  trialDays: number;
  promoMonths: number;
  sortOrder: number;
}

type Interval = 'WEEK' | 'MONTH' | 'YEAR';

function planPrice(plan: SubscriptionPlan, interval: Interval): number {
  if (interval === 'WEEK') return plan.priceWeeklyCents / 100;
  if (interval === 'MONTH') return plan.priceMonthlyCents / 100;
  return plan.priceAnnualCents / 100;
}

function perLabel(interval: Interval): string {
  if (interval === 'WEEK') return '/semana';
  if (interval === 'MONTH') return '/mes';
  return '/año';
}

function savingsNote(plan: SubscriptionPlan, interval: Interval): string {
  if (interval === 'WEEK') return 'Precio base';
  if (interval === 'MONTH') {
    const saved = (plan.priceWeeklyCents * 4 - plan.priceMonthlyCents) / 100;
    return `Cada 4 semanas · ahorras $${saved.toLocaleString('es-MX')}`;
  }
  const perWeek = Math.round(plan.priceAnnualCents / 52 / 100);
  const saved = (plan.priceWeeklyCents * 52 - plan.priceAnnualCents) / 100;
  return `Sale a $${perWeek.toLocaleString('es-MX')}/semana · ahorras $${saved.toLocaleString('es-MX')}`;
}

interface PlanesSectionProps {
  plans: SubscriptionPlan[];
}

export function PlanesSection({ plans }: PlanesSectionProps) {
  const [interval, setInterval] = useState<Interval>('MONTH');
  const sorted = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);
  const promoPlan = sorted.find((p) => p.promoMonths > 0 && p.promoPriceCents != null);

  return (
    <section
      id="planes"
      style={{
        padding: '72px 24px',
        maxWidth: 1180,
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 660 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#6C47FF',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}
        >
          Planes
        </div>
        <h2 id="rg-plans-title">Paga por semana, mes o año</h2>
        <p style={{ fontSize: 18, lineHeight: '27px', color: '#57544f', margin: 0 }}>
          Prepago. Entre más largo el periodo, más ahorras. Los pedidos son ilimitados en los dos planes.
        </p>
      </div>

      {/* Promo banner + Interval selector — misma fila */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {promoPlan && (
          <div
            style={{
              background: '#C6FF3D',
              borderRadius: 16,
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 16, color: '#121214' }}>
              Primeros <strong>{promoPlan.trialDays} días gratis</strong>, luego{' '}
              <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>
                ${(promoPlan.promoPriceCents! / 100).toLocaleString('es-MX')} MXN/mes
              </strong>{' '}
              por los primeros {promoPlan.promoMonths} meses en cualquier plan
            </span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 5,
            borderRadius: 999,
            background: '#FFFDFA',
            border: '1px solid #DED7C9',
          }}
        >
          {(
            [
              { value: 'WEEK' as Interval, label: 'Semanal', badge: null },
              {
                value: 'MONTH' as Interval,
                label: 'Mensual',
                badge: { text: '−5%', bg: '#F1EDFF', color: '#4B2FD6' },
              },
              {
                value: 'YEAR' as Interval,
                label: 'Anual',
                badge: { text: 'Ahorra 25%', bg: '#C6FF3D', color: '#121214' },
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value)}
              style={{
                height: 44,
                padding: '0 18px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 700,
                background: interval === opt.value ? '#121214' : 'transparent',
                color: interval === opt.value ? '#C6FF3D' : '#57544f',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 180ms cubic-bezier(.2,0,.2,1)',
                whiteSpace: 'nowrap',
              }}
            >
              {opt.label}
              {opt.badge && (
                <span
                  style={{
                    height: 22,
                    padding: '0 8px',
                    borderRadius: 999,
                    background: opt.badge.bg,
                    color: opt.badge.color,
                    fontSize: 12,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {opt.badge.text}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div id="rg-plan-cards">
        {sorted.map((plan, idx) => {
          const isDark = idx === 1;
          const price = planPrice(plan, interval);
          const note = savingsNote(plan, interval);
          const hasPromo = plan.promoMonths > 0 && plan.promoPriceCents != null;

          return (
            <div
              key={plan.id}
              style={{
                background: isDark ? '#121214' : '#FFFDFA',
                border: isDark ? 'none' : '1px solid #DED7C9',
                borderRadius: 22,
                padding: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
                minWidth: 0,
              }}
            >
              {isDark && (
                <span
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: 30,
                    height: 28,
                    padding: '0 13px',
                    borderRadius: 999,
                    background: '#C6FF3D',
                    color: '#121214',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '.04em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Más elegido
                </span>
              )}

              {/* Plan name + subtitle */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '-.01em',
                    color: isDark ? '#F3EFE7' : '#121214',
                  }}
                >
                  {plan.name}
                </div>
                <div style={{ fontSize: 15, color: isDark ? '#8E8B93' : '#57544f' }}>
                  {idx === 0 ? 'Un solo local, sin complicarse.' : 'Varias sucursales y turnos completos.'}
                </div>
              </div>

              {/* Price block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                      fontSize: 46,
                      fontWeight: 700,
                      letterSpacing: '-.03em',
                      lineHeight: 1,
                      color: isDark ? '#C6FF3D' : '#121214',
                    }}
                  >
                    ${price.toLocaleString('es-MX')}
                  </span>
                  <span style={{ fontSize: 17, color: isDark ? '#8E8B93' : '#57544f' }}>
                    {perLabel(interval)}
                  </span>
                </div>

                <span style={{ fontSize: 15, color: isDark ? '#8E8B93' : '#57544f' }}>{note}</span>

                {hasPromo && (
                  <span style={{ fontSize: 14, color: isDark ? '#8E8B93' : '#57544f' }}>
                    Primeros {plan.promoMonths} meses a{' '}
                    <strong style={{ color: isDark ? '#F3EFE7' : '#121214' }}>
                      ${(plan.promoPriceCents! / 100).toLocaleString('es-MX')}/mes
                    </strong>
                  </span>
                )}
              </div>

              {/* CTA */}
              <a
                href="/negocio/registro"
                style={{
                  height: 54,
                  borderRadius: 999,
                  background: isDark ? '#6C47FF' : '#121214',
                  color: isDark ? '#ffffff' : '#C6FF3D',
                  fontSize: 16,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Probar {plan.trialDays > 0 ? `${plan.trialDays} días gratis` : 'ahora'}
              </a>

              {/* Divider */}
              <div style={{ height: 1, background: isDark ? '#2A2A31' : '#F0EBE1' }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {(idx === 0
                  ? [
                      '1 sucursal',
                      'Hasta 3 usuarios del equipo',
                      'Pedidos ilimitados',
                      'Pedidos programados',
                      'Seguimiento en vivo y corte semanal',
                    ]
                  : [
                      'Hasta 5 sucursales',
                      'Hasta 10 usuarios del equipo',
                      'Todo lo de Starter, ilimitado',
                      'Analítica avanzada por sucursal y zona',
                      'Acceso a la API para conectar tu punto de venta',
                      'IA integrada para direcciones y horas pico',
                    ]
                ).map((f) => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDark ? '#C6FF3D' : '#6C47FF'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginTop: 3, flex: 'none' }}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span style={{ fontSize: 16, lineHeight: '24px', color: isDark ? '#F3EFE7' : '#121214' }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow steps */}
      <div
        style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 20,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: '#7d7972',
          }}
        >
          Qué pasa después de registrarte
        </span>
        <div id="rg-plan-flow">
          {[
            {
              n: '1',
              bg: '#C6FF3D',
              color: '#121214',
              border: undefined,
              label: '3 días gratis',
              desc: 'Pruebas con pedidos reales. Sin tarjeta al inicio.',
            },
            {
              n: '2',
              bg: '#6C47FF',
              color: '#fff',
              border: undefined,
              label: '3 meses a $20/mes',
              desc: 'Precio de lanzamiento, en cualquier plan e intervalo.',
            },
            {
              n: '3',
              bg: '#121214',
              color: '#C6FF3D',
              border: undefined,
              label: 'Precio normal',
              desc: 'Semanal, mensual (−5%) o anual (−25%). Cambias cuando quieras.',
            },
            {
              n: '4',
              bg: 'transparent',
              color: '#FF5A5F',
              border: '1.5px solid #FF5A5F',
              label: 'Sin pago, cuenta en pausa',
              desc: 'Se pausa sola y no acumula deuda. Pagas y sigues.',
            },
          ].map((step) => (
            <div key={step.n} style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: step.bg,
                    border: step.border ?? 'none',
                    color: step.color,
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                  }}
                >
                  {step.n}
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#121214' }}>{step.label}</span>
              </div>
              <span style={{ fontSize: 15, lineHeight: '22px', color: '#57544f' }}>{step.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
