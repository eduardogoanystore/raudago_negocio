'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingHeader } from './OnboardingHeader';
import { createNegocioCheckoutAction } from '@/actions/onboarding';
import type { SubscriptionPlan } from '@/lib/subscription';

type Interval = 'WEEK' | 'MONTH' | 'YEAR';

// ─── Tipos para pre-lanzamiento ───────────────────────────────────────────────

export interface PreLanzamientoZona {
  name: string;
  meta_negocios_apertura: number;
  meta_repartidores_apertura: number;
  negocios_en_espera: number;
  repartidores_en_espera: number;
}

// ─── Subcomponente: barra de progreso ─────────────────────────────────────────

function ProgressBar({ actual, meta, label }: { actual: number; meta: number; label: string }) {
  const pct = meta > 0 ? Math.min(100, (actual / meta) * 100) : 0;
  const done = pct >= 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: '#57544f' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#121214' }}>
          {actual} / {meta}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: '#DED7C9', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: done ? '#22C55E' : '#6C47FF',
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}

// ─── Subcomponente: banner + CTA referidos para pre-lanzamiento ───────────────

function PreLanzamientoBanner({
  zona,
  businessSlug,
}: {
  zona: PreLanzamientoZona;
  businessSlug: string;
}) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://raudago.com/registro?ref=${businessSlug}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div
      style={{
        background: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: 14,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#92400E',
            background: '#FDE68A',
            border: '1px solid #F59E0B',
            borderRadius: 999,
            padding: '2px 10px',
            whiteSpace: 'nowrap',
          }}
        >
          Pronto — {zona.name}
        </span>
      </div>

      {/* Título y subtítulo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#121214', margin: 0 }}>
          Tu zona abre pronto
        </p>
        <p style={{ fontSize: 13, color: '#57544f', margin: 0, lineHeight: 1.5 }}>
          Reserva tu lugar — cuando se complete el cupo, la zona abre y puedes empezar a operar.
        </p>
      </div>

      {/* Barras de progreso */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ProgressBar
          actual={zona.negocios_en_espera}
          meta={zona.meta_negocios_apertura}
          label={`${zona.negocios_en_espera} de ${zona.meta_negocios_apertura} negocios reservados en tu zona`}
        />
      </div>

      {/* CTA referidos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 13, color: '#57544f', margin: 0 }}>
          ¿Conoces otros negocios en tu zona? Invitalos y tu zona abre antes.
        </p>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            height: 40,
            borderRadius: 10,
            border: '1.5px solid #F59E0B',
            background: copied ? '#DCFCE7' : '#FFFDFA',
            color: copied ? '#166534' : '#92400E',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.2s, color 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Enlace copiado
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Compartir mi link
            </>
          )}
        </button>
        <p style={{ fontSize: 11, color: '#8E8B93', margin: 0, wordBreak: 'break-all' }}>
          {referralUrl}
        </p>
      </div>
    </div>
  );
}

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
  /** Si se pasa, la zona está en pre-lanzamiento: se muestran planes bloqueados + banner de reserva */
  prelanzamiento?: {
    zona: PreLanzamientoZona;
    businessSlug: string;
  };
}

export function OnboardingPlanSelector({ plans, initialPlanKey, initialInterval, businessName, prelanzamiento }: Props) {
  const router = useRouter();
  const sorted = [...plans].sort((a, b) => a.sort_order - b.sort_order);
  const [interval, setInterval] = useState<Interval>(initialInterval ?? 'WEEK');
  const defaultPlan = (initialPlanKey ? sorted.find((p) => p.key === initialPlanKey) : null) ?? sorted[0];
  const [selectedId, setSelectedId] = useState<string>(defaultPlan?.id ?? '');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [reservaToast, setReservaToast] = useState(false);

  const selectedPlan = sorted.find((p) => p.id === selectedId) ?? sorted[0] ?? null;
  const price = selectedPlan ? planPrice(selectedPlan, interval) : 0;

  const trialDays = selectedPlan?.trial_days ?? null;
  const promoWeeks =
    selectedPlan?.promo_weeks ?? null;
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
      if (result?.error) {
        if (result.error === 'NO_SLOT_AVAILABLE') {
          router.push('/registro/espera');
          return;
        }
        setCheckoutError(result.error);
      }
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
            title={prelanzamiento ? 'Reserva tu lugar' : 'Elige tu plan'}
            subtitle={
              prelanzamiento
                ? `${prelanzamiento.zona.name} · cuando la zona abra, activas tu plan.`
                : businessName
                  ? `${businessName} · pedidos ilimitados en ambos planes.`
                  : 'Pedidos ilimitados en ambos planes.'
            }
          />

          {/* Interval selector */}
          <div style={{ display: 'flex', gap: 4, padding: 5, borderRadius: 999, background: '#FFFDFA', border: '1px solid #DED7C9', width: 'fit-content' }}>
            {(
              (() => {
                const ref = selectedPlan;
                const monthSave = ref && ref.price_weekly_cents > 0
                  ? Math.round((1 - ref.price_monthly_cents / (ref.price_weekly_cents * 4)) * 100)
                  : 5;
                const yearSave = ref && ref.price_weekly_cents > 0
                  ? Math.round((1 - ref.price_annual_cents / (ref.price_weekly_cents * 52)) * 100)
                  : 25;
                return [
                  { value: 'WEEK'  as Interval, label: 'Semanal' },
                  { value: 'MONTH' as Interval, label: 'Mensual', save: `−${monthSave}%` },
                  { value: 'YEAR'  as Interval, label: 'Anual',   save: `−${yearSave}%`  },
                ];
              })()
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

          {/* Banner pre-lanzamiento — reemplaza el promo banner en modo reserva */}
          {prelanzamiento && (
            <PreLanzamientoBanner
              zona={prelanzamiento.zona}
              businessSlug={prelanzamiento.businessSlug}
            />
          )}

          {/* Promo banner — only shown when the selected plan has promo data (no pre-lanzamiento) */}
          {!prelanzamiento && showPromoBanner && (
            <div style={{ background: '#C6FF3D', borderRadius: 14, padding: '12px 18px', fontSize: 15 }}>
              <strong>{trialDays} días gratis</strong>, luego{' '}
              <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>${promoPrice!.toLocaleString('es-MX')}/semana</strong>{' '}
              las primeras {promoWeeks} semanas. Después, el precio normal.
            </div>
          )}

          {/* Plan cards */}
          <div id="rg-plan-cards">
            {sorted.map((plan) => {
              // En pre-lanzamiento, todas las cards se ven como no seleccionadas (aspecto neutro)
              const on      = !prelanzamiento && plan.id === selectedId;
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
                  onClick={prelanzamiento ? undefined : () => setSelectedId(plan.id)}
                  style={{
                    background: bg, border: bd, borderRadius: 20, padding: 22,
                    display: 'flex', flexDirection: 'column', gap: 14,
                    cursor: prelanzamiento ? 'default' : 'pointer',
                    opacity: prelanzamiento ? 0.72 : 1,
                    transition: 'background 150ms',
                  }}
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
            {selectedPlan && selectedPlan.promo_weeks > 0 && selectedPlan.promo_price_cents != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ color: '#57544f' }}>Promo {selectedPlan.promo_weeks} semanas</span>
                <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>
                  ${(selectedPlan.promo_price_cents / 100).toLocaleString('es-MX')}/sem
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
            {prelanzamiento ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReservaToast(true);
                    setTimeout(() => router.push('/registro/espera'), 1500);
                  }}
                  style={{
                    height: 56, borderRadius: 999, border: 'none',
                    background: '#E5E0D8',
                    color: '#8E8B93', fontSize: 17, fontWeight: 700,
                    cursor: 'default',
                    fontFamily: 'inherit',
                  }}
                >
                  Reservar lugar
                </button>
                {reservaToast && (
                  <p style={{ fontSize: 13, color: '#57544f', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                    Tu lugar queda reservado. Te avisamos cuando tu zona abra.
                  </p>
                )}
                <span style={{ fontSize: 12, lineHeight: '18px', color: '#7d7972', textAlign: 'center' }}>
                  Sin cobros hasta que tu zona abra.
                </span>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
