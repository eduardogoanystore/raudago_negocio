'use client';

import { useState, useTransition } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { createNegocioCheckoutAction } from '@/actions/onboarding';
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

function intervalLabel(interval: Interval): string {
  if (interval === 'WEEK') return 'semanal';
  if (interval === 'MONTH') return 'mensual';
  return 'anual';
}

function savingsNote(plan: SubscriptionPlan, interval: Interval): string {
  if (interval === 'WEEK') return 'Precio base';
  if (interval === 'MONTH') {
    const saved = Math.round((plan.price_weekly_cents * 4 - plan.price_monthly_cents) / 100);
    return `Cada 4 semanas · ahorras $${saved.toLocaleString('es-MX')}`;
  }
  const perWeek = Math.round(plan.price_annual_cents / 52 / 100);
  return `Sale a $${perWeek.toLocaleString('es-MX')}/semana`;
}

function ordersLabel(n: number | null | undefined): string {
  if (n == null) return 'Ilimitados';
  return `Hasta ${n.toLocaleString('es-MX')}/sem`;
}
function branchesLabel(n: number | null | undefined): string {
  if (n == null) return 'Ilimitadas';
  return n === 1 ? '1 sucursal' : `Hasta ${n}`;
}
function membersLabel(n: number | null | undefined): string {
  if (n == null) return 'Ilimitados';
  return n === 1 ? '1 usuario' : `Hasta ${n}`;
}


interface Props {
  plans: SubscriptionPlan[];
  initialPlanKey?: string;
  initialInterval?: Interval;
  businessName?: string;
}

export function OnboardingPlanSelector({ plans, initialPlanKey, initialInterval, businessName }: Props) {
  const sorted = [...plans].sort((a, b) => a.sort_order - b.sort_order);
  const [interval, setInterval] = useState<Interval>(initialInterval ?? 'WEEK');
  const defaultPlan = (initialPlanKey ? sorted.find((p) => p.key === initialPlanKey) : null) ?? sorted[0];
  const [selectedId, setSelectedId] = useState<string>(defaultPlan?.id ?? '');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedPlan = sorted.find((p) => p.id === selectedId) ?? sorted[0] ?? null;
  const price = selectedPlan ? planPrice(selectedPlan, interval) : 0;

  const trialDays = selectedPlan?.trial_days ?? null;
  const promoWeeks =
    selectedPlan?.promo_weeks ??
    (selectedPlan?.promo_months ? selectedPlan.promo_months * 4 : null);
  const promoPrice =
    selectedPlan?.promo_price_cents != null
      ? selectedPlan.promo_price_cents / 100
      : null;
  const showPromoBanner = trialDays != null && promoWeeks != null && promoPrice != null;

  function handleCheckout() {
    if (!selectedPlan) return;
    setCheckoutError(null);
    startTransition(async () => {
      const result = await createNegocioCheckoutAction(selectedPlan.id, interval);
      if (result?.error) setCheckoutError(result.error);
    });
  }

  return (
    <>
      <style>{`
        #rg-plan-layout  { display: flex; height: 100vh; overflow: hidden; }
        #rg-plan-left    { flex: 1; min-width: 0; overflow-y: auto; height: 100vh; }
        #rg-plan-sidebar { width: 380px; flex-shrink: 0; height: 100vh; overflow-y: auto; position: sticky; top: 0; }
        #rg-plan-cards   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 760px) {
          #rg-plan-layout  { flex-direction: column; height: auto; overflow: visible; }
          #rg-plan-left    { height: auto; overflow-y: visible; }
          #rg-plan-sidebar { width: 100% !important; height: auto; position: static; border-left: none !important; border-top: 1px solid #DED7C9; }
          #rg-plan-cards   { grid-template-columns: 1fr; }
        }
      `}</style>

      <div id="rg-plan-layout">

        {/* ── Left panel ── */}
        <div id="rg-plan-left" style={{ flex: 1, minWidth: 0, padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <OnboardingHeader
            step={3}
            title="Elige tu plan"
            subtitle={businessName ? `${businessName} · pedidos ilimitados en ambos planes.` : 'Pedidos ilimitados en ambos planes.'}
          />

          {/* Interval selector */}
          <div style={{ display: 'flex', gap: 4, padding: 5, borderRadius: 999, background: '#FFFDFA', border: '1px solid #DED7C9', width: 'fit-content' }}>
            {(
              [
                { value: 'WEEK'  as Interval, label: 'Semanal' },
                { value: 'MONTH' as Interval, label: 'Mensual', save: '−5%'  },
                { value: 'YEAR'  as Interval, label: 'Anual',   save: '−25%' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setInterval(opt.value)}
                style={{
                  height: 42, padding: '0 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                  background: interval === opt.value ? '#121214' : 'transparent',
                  color:      interval === opt.value ? '#C6FF3D' : '#57544f',
                  display: 'flex', alignItems: 'center', gap: 7,
                  whiteSpace: 'nowrap', transition: 'all 150ms',
                }}
              >
                {opt.label}
                {'save' in opt && opt.save && (
                  <span style={{ height: 22, padding: '0 7px', borderRadius: 999, background: '#C6FF3D', color: '#121214', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center' }}>
                    {opt.save}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Promo banner — only shown when the selected plan has promo data */}
          {showPromoBanner && (
            <div style={{ background: '#C6FF3D', borderRadius: 14, padding: '12px 18px', fontSize: 15 }}>
              <strong>{trialDays} días gratis</strong>, luego{' '}
              <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>${promoPrice!.toLocaleString('es-MX')}/semana</strong>{' '}
              las primeras {promoWeeks} semanas. Después, el precio normal.
            </div>
          )}

          {/* Plan cards */}
          <div id="rg-plan-cards">
            {sorted.map((plan) => {
              const on      = plan.id === selectedId;
              const fg      = on ? '#fff'     : '#121214';
              const muted   = on ? '#8E8B93'  : '#57544f';
              const priceC  = on ? '#C6FF3D'  : '#121214';
              const bg      = on ? '#121214'  : '#FFFDFA';
              const bd      = on ? '2px solid #121214' : '1px solid #DED7C9';
              const radio   = on ? '7px solid #C6FF3D' : '2px solid #DED7C9';
              const cardPrice = planPrice(plan, interval);

              const divider = <div style={{ height: 1, background: on ? '#2a2a2e' : '#F0EBE1', margin: '2px 0' }} />;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedId(plan.id)}
                  style={{ background: bg, border: bd, borderRadius: 20, padding: 22, display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer', transition: 'background 150ms' }}
                >
                  {/* Name + radio */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: fg }}>{plan.name}</span>
                    <span style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: '50%', border: radio, boxSizing: 'border-box', display: 'block', flexShrink: 0 }} />
                  </div>

                  {/* Price */}
                  {plan.key === 'cadenas' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: 'var(--font-poppins), Poppins, system-ui', fontSize: 32, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1, color: priceC }}>
                        A tu medida
                      </span>
                      <span style={{ fontSize: 13, color: muted }}>3 sucursales o más · te contactamos hoy</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                        <span style={{ fontFamily: 'var(--font-poppins), Poppins, system-ui', fontSize: 42, fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1, color: priceC }}>
                          ${cardPrice.toLocaleString('es-MX')}
                        </span>
                        <span style={{ fontSize: 15, color: muted }}>{perLabel(interval)} · IVA incl.</span>
                      </div>
                      <span style={{ fontSize: 13, color: muted }}>{savingsNote(plan, interval)}</span>
                    </div>
                  )}

                  {divider}

                  {/* Stats strip */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      { icon: '📦', label: 'Pedidos', value: ordersLabel(plan.max_orders_weekly) },
                      { icon: '🏪', label: 'Sucursales', value: plan.key === 'cadenas' ? '3 o más' : branchesLabel(plan.max_branches) },
                      { icon: '👥', label: 'Usuarios', value: membersLabel(plan.max_members) },
                    ].map(({ icon, label, value }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 17 }}>{icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: fg }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  {plan.features && plan.features.length > 0 && (
                    <>
                      {divider}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {plan.features.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: '18px', color: fg }}>
                            <span style={{ color: on ? '#C6FF3D' : '#6C47FF', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Description / context */}
                  {plan.description && (
                    <span style={{ fontSize: 12, color: muted, lineHeight: '16px', fontStyle: 'italic' }}>
                      {plan.description}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {sorted.length === 0 && (
            <p style={{ fontSize: 15, color: '#8E8B93', textAlign: 'center', padding: '40px 0' }}>
              No hay planes disponibles en este momento.
            </p>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div
          id="rg-plan-sidebar"
          style={{ width: 380, flexShrink: 0, background: '#FFFDFA', borderLeft: '1px solid #DED7C9', padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#7d7972' }}>
            Resumen
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ color: '#57544f' }}>Plan</span>
              <strong style={{ textAlign: 'right' }}>
                {selectedPlan ? `${selectedPlan.name} · ${intervalLabel(interval)}` : '—'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ color: '#57544f' }}>Hoy</span>
              <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>$0</strong>
            </div>
            {selectedPlan && selectedPlan.promo_months > 0 && selectedPlan.promo_price_cents != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#57544f' }}>Promo {selectedPlan.promo_months} meses</span>
                <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>
                  ${(selectedPlan.promo_price_cents / 100).toLocaleString('es-MX')}/mes
                </strong>
              </div>
            )}
            {selectedPlan && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#57544f' }}>Después</span>
                <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>
                  ${price.toLocaleString('es-MX')}{perLabel(interval)}
                </strong>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: '#F0EBE1' }} />

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleCheckout}
              disabled={isPending || !selectedPlan}
              style={{
                height: 56, borderRadius: 999, border: 'none',
                background: isPending ? '#A08EFF' : '#6C47FF',
                color: '#fff', fontSize: 17, fontWeight: 700,
                cursor: isPending || !selectedPlan ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
            >
              {isPending ? 'Redirigiendo...' : 'Continuar al pago'}
            </button>
            {checkoutError && (
              <p style={{ fontSize: 13, color: '#B00020', margin: 0, textAlign: 'center' }}>{checkoutError}</p>
            )}
            <span style={{ fontSize: 12, lineHeight: '18px', color: '#7d7972', textAlign: 'center' }}>
              Sigue el checkout seguro de Stripe. Hoy no se cobra nada.
            </span>
          </div>
        </div>

      </div>
    </>
  );
}
