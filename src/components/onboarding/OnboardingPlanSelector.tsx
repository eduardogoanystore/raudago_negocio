'use client';

import { useState } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { NegocioPlanButton } from './NegocioPlanButton';
import type { SubscriptionPlan } from '@/lib/subscription';

type Interval = 'WEEK' | 'MONTH' | 'YEAR';

function planPrice(plan: SubscriptionPlan, interval: Interval): number {
  if (interval === 'WEEK') return plan.price_weekly_cents / 100;
  if (interval === 'MONTH') return plan.price_monthly_cents / 100;
  return plan.price_annual_cents / 100;
}

function perLabel(interval: Interval): string {
  if (interval === 'WEEK') return '/semana';
  if (interval === 'MONTH') return '/mes';
  return '/año';
}

interface OnboardingPlanSelectorProps {
  plans: SubscriptionPlan[];
}

export function OnboardingPlanSelector({ plans }: OnboardingPlanSelectorProps) {
  const [interval, setInterval] = useState<Interval>('MONTH');
  const sorted = [...plans].sort((a, b) => (a.promo_months ?? 0) - (b.promo_months ?? 0));

  return (
    <div>
      {/* Card wrapper */}
      <div
        style={{
          background: '#FFFDFA',
          borderRadius: 24,
          border: '1px solid #DED7C9',
          padding: '40px 36px',
        }}
      >
        <OnboardingHeader
          step={3}
          title="Elige tu plan"
          subtitle="Empieza con tu prueba gratuita. Cancela cuando quieras."
        />

        {/* Interval selector */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 5,
            borderRadius: 999,
            background: '#F3EFE7',
            border: '1px solid #DED7C9',
            marginBottom: 28,
            width: 'fit-content',
          }}
        >
          {(
            [
              { value: 'WEEK' as Interval, label: 'Semanal' },
              { value: 'MONTH' as Interval, label: 'Mensual', badge: '−5%' },
              { value: 'YEAR' as Interval, label: 'Anual', badge: '−25%' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setInterval(opt.value)}
              style={{
                height: 38,
                padding: '0 16px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
                background: interval === opt.value ? '#121214' : 'transparent',
                color: interval === opt.value ? '#C6FF3D' : '#57544f',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 150ms',
              }}
            >
              {opt.label}
              {'badge' in opt && opt.badge && (
                <span
                  style={{
                    height: 20,
                    padding: '0 7px',
                    borderRadius: 999,
                    background: interval === opt.value ? '#C6FF3D' : '#E5E0D8',
                    color: interval === opt.value ? '#121214' : '#57544f',
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {sorted.map((plan, idx) => {
            const isDark = idx === 1;
            const price = planPrice(plan, interval);

            return (
              <div
                key={plan.id}
                style={{
                  background: isDark ? '#121214' : '#F3EFE7',
                  border: isDark ? 'none' : '1px solid #DED7C9',
                  borderRadius: 18,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  position: 'relative',
                }}
              >
                {isDark && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -12,
                      left: 20,
                      height: 24,
                      padding: '0 10px',
                      borderRadius: 999,
                      background: '#C6FF3D',
                      color: '#121214',
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '.04em',
                      textTransform: 'uppercase',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    Mas elegido
                  </span>
                )}

                {/* Name */}
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isDark ? '#F3EFE7' : '#121214',
                  }}
                >
                  {plan.name}
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      color: isDark ? '#C6FF3D' : '#121214',
                    }}
                  >
                    ${price.toLocaleString('es-MX')}
                  </span>
                  <span style={{ fontSize: 15, color: isDark ? '#8E8B93' : '#57544f' }}>
                    {perLabel(interval)}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: isDark ? '#6B6B75' : '#9B9590', marginTop: -10 }}>
                  IVA incluido
                </span>

                {/* Promo note */}
                {plan.promo_months > 0 && plan.promo_price_cents != null && (
                  <div
                    style={{
                      background: isDark ? '#1E1E26' : '#FFFDFA',
                      border: `1px solid ${isDark ? '#2A2A31' : '#DED7C9'}`,
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 13,
                      color: isDark ? '#8E8B93' : '#57544f',
                    }}
                  >
                    Primeros <strong style={{ color: isDark ? '#F3EFE7' : '#121214' }}>{plan.promo_months} meses</strong> a{' '}
                    <strong style={{ color: isDark ? '#C6FF3D' : '#6C47FF' }}>
                      ${(plan.promo_price_cents / 100).toLocaleString('es-MX')}/mes
                    </strong>
                  </div>
                )}

                {/* CTA */}
                <NegocioPlanButton planId={plan.id} interval={interval} />
              </div>
            );
          })}
        </div>

        {/* No plans fallback */}
        {sorted.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 0',
              color: '#8E8B93',
              fontSize: 15,
            }}
          >
            No hay planes disponibles en este momento. Intenta de nuevo en unos minutos.
          </div>
        )}
      </div>
    </div>
  );
}
