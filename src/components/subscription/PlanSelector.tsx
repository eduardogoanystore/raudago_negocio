'use client';

import { useState } from 'react';
import {
  startSubscriptionCheckout,
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
  claimAnnualGuaranteeAction,
} from '@/actions/subscription';
import type { SubscriptionPlan, UserSubscription } from '@/lib/subscription';

interface PlanSelectorProps {
  plans: SubscriptionPlan[];
  currentSubscription?: UserSubscription | null;
  initialPlanId?: string;
  initialInterval?: string;
}

type Interval = 'WEEK' | 'MONTH' | 'YEAR';

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

const INTERVAL_LABELS: Record<Interval, string> = {
  WEEK: 'Semanal',
  MONTH: 'Mensual',
  YEAR: 'Anual',
};

function getPriceForInterval(plan: SubscriptionPlan, interval: Interval): number {
  if (interval === 'WEEK') return plan.price_weekly_cents;
  if (interval === 'MONTH') return plan.price_monthly_cents;
  return plan.price_annual_cents;
}

function getPromoPrice(plan: SubscriptionPlan, interval: Interval): number | null {
  if (!plan.promo_price_cents || !plan.promo_weeks) return null;
  // promo_price_cents es el precio semanal de la Fase 2 del Subscription Schedule
  if (interval === 'WEEK') return plan.promo_price_cents;
  return null; // promo solo aplica en cobros semanales (Fase 2)
}

export function PlanSelector({
  plans,
  currentSubscription,
  initialPlanId,
  initialInterval,
}: PlanSelectorProps) {
  const defaultPlanId = initialPlanId ?? plans[0]?.id ?? '';
  const defaultInterval: Interval =
    (initialInterval as Interval) && ['WEEK', 'MONTH', 'YEAR'].includes(initialInterval as string)
      ? (initialInterval as Interval)
      : 'MONTH';

  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [interval, setInterval] = useState<Interval>(defaultInterval);
  const [loading, setLoading] = useState(false);
  const [managingLoading, setManagingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manageError, setManageError] = useState<string | null>(null);
  const [guaranteeResult, setGuaranteeResult] = useState<{ refundAmountCents: number } | null>(null);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const hasActiveSub =
    currentSubscription && ['ACTIVE', 'TRIALING'].includes(currentSubscription.status);

  // Garantía 14 días plan anual: solo si es anual, activo, y dentro de 14 días del inicio del periodo
  const annualGuaranteeDaysLeft = (() => {
    if (!currentSubscription) return null;
    if (currentSubscription.billingCycleType !== 'YEAR') return null;
    if (!['ACTIVE'].includes(currentSubscription.status)) return null;
    if (!currentSubscription.currentPeriodStart) return null;
    const start = new Date(currentSubscription.currentPeriodStart);
    const daysSince = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24);
    const daysLeft = Math.floor(14 - daysSince);
    return daysLeft > 0 ? daysLeft : null;
  })();

  async function handleCheckout() {
    if (!selectedPlan) return;
    setLoading(true);
    setError(null);
    try {
      const result = await startSubscriptionCheckout(selectedPlan.id, interval);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      window.location.href = result.checkoutUrl;
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setManagingLoading(true);
    setManageError(null);
    try {
      const result = await cancelSubscriptionAction();
      if (result.error) {
        setManageError(result.error);
      } else {
        window.location.reload();
      }
    } catch {
      setManageError('Error inesperado. Intenta de nuevo.');
    } finally {
      setManagingLoading(false);
    }
  }

  async function handleClaimGuarantee() {
    setManagingLoading(true);
    setManageError(null);
    try {
      const result = await claimAnnualGuaranteeAction();
      if (result.error) {
        setManageError(result.error);
      } else if (result.refundAmountCents) {
        setGuaranteeResult({ refundAmountCents: result.refundAmountCents });
      }
    } catch {
      setManageError('Error inesperado. Intenta de nuevo.');
    } finally {
      setManagingLoading(false);
    }
  }

  async function handleReactivate() {
    setManagingLoading(true);
    setManageError(null);
    try {
      const result = await reactivateSubscriptionAction();
      if (result.error) {
        setManageError(result.error);
      } else {
        window.location.reload();
      }
    } catch {
      setManageError('Error inesperado. Intenta de nuevo.');
    } finally {
      setManagingLoading(false);
    }
  }

  const currentPrice = selectedPlan ? getPriceForInterval(selectedPlan, interval) : 0;
  const promoPrice = selectedPlan ? getPromoPrice(selectedPlan, interval) : null;

  return (
    <div>
      {/* Interval toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        {(['WEEK', 'MONTH', 'YEAR'] as Interval[]).map((iv) => (
          <button
            key={iv}
            onClick={() => setInterval(iv)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '2rem',
              border: interval === iv ? '2px solid #6C47FF' : '2px solid #E5E0D8',
              background: interval === iv ? '#6C47FF' : 'white',
              color: interval === iv ? 'white' : '#3A3A44',
              fontWeight: interval === iv ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {INTERVAL_LABELS[iv]}
          </button>
        ))}
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)`,
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {plans.map((plan) => {
          const isSelected = plan.id === selectedPlanId;
          const price = getPriceForInterval(plan, interval);
          const promo = getPromoPrice(plan, interval);
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              style={{
                border: isSelected ? '2px solid #6C47FF' : '2px solid #E5E0D8',
                borderRadius: '1rem',
                padding: '1.5rem',
                background: isSelected ? '#FAF8FF' : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                boxShadow: isSelected ? '0 0 0 3px rgba(108,71,255,0.12)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#121214',
                  marginBottom: '0.5rem',
                }}
              >
                {plan.name}
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                {promo ? (
                  <div>
                    <span
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#6C47FF',
                      }}
                    >
                      {formatPrice(promo)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        textDecoration: 'line-through',
                        marginLeft: '0.4rem',
                      }}
                    >
                      {formatPrice(price)}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      primeras {plan.promo_weeks} semanas
                    </div>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#121214',
                    }}
                  >
                    {formatPrice(price)}
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', color: '#6B7280', marginLeft: '0.25rem' }}>
                  /{INTERVAL_LABELS[interval].toLowerCase()}
                </span>
              </div>
              {isSelected && (
                <div
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '50%',
                    background: '#6C47FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                    ✓
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Price summary */}
      {selectedPlan && (
        <div
          style={{
            background: 'white',
            border: '1px solid #E5E0D8',
            borderRadius: '1rem',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <span style={{ color: '#3A3A44', fontSize: '0.95rem' }}>
              {selectedPlan.name} — {INTERVAL_LABELS[interval]}
            </span>
            <span style={{ fontWeight: 700, color: '#121214', fontSize: '1rem' }}>
              {formatPrice(currentPrice)}
            </span>
          </div>
          {promoPrice && (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#059669',
                background: '#ECFDF5',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.75rem',
              }}
            >
              Precio promo las primeras {selectedPlan.promo_weeks} semanas:{' '}
              <strong>{formatPrice(promoPrice)}</strong>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            background: '#FEE2E2',
            color: '#B91C1C',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* CTA */}
      {!hasActiveSub && (
        <button
          onClick={handleCheckout}
          disabled={loading || !selectedPlan}
          style={{
            width: '100%',
            padding: '0.875rem',
            background: loading || !selectedPlan ? '#A78BFA' : '#6C47FF',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: loading || !selectedPlan ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
          }}
        >
          {loading
            ? 'Redirigiendo...'
            : selectedPlan
              ? `Continuar con ${selectedPlan.name}`
              : 'Selecciona un plan'}
        </button>
      )}

      {/* Manage subscription section */}
      {hasActiveSub && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'white',
            border: '1px solid #E5E0D8',
            borderRadius: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#121214', marginBottom: '1rem' }}>
            Gestionar suscripcion
          </h2>

          {manageError && (
            <div
              role="alert"
              style={{
                background: '#FEE2E2',
                color: '#B91C1C',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              {manageError}
            </div>
          )}

          {currentSubscription?.cancelAtPeriodEnd ? (
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Tu suscripcion se cancelara al final del periodo actual. Puedes reactivarla aqui.
              </p>
              <button
                onClick={handleReactivate}
                disabled={managingLoading}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: managingLoading ? '#A78BFA' : '#6C47FF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: managingLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {managingLoading ? 'Procesando...' : 'Reactivar suscripcion'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {guaranteeResult ? (
                <div style={{ background: '#ECFDF5', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#065F46' }}>
                  Reembolso de {formatPrice(guaranteeResult.refundAmountCents)} procesado. Tu suscripción ha sido cancelada.
                </div>
              ) : (
                <>
                  {annualGuaranteeDaysLeft !== null && (
                    <div>
                      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Garantía de 14 días — te quedan <strong>{annualGuaranteeDaysLeft} día{annualGuaranteeDaysLeft !== 1 ? 's' : ''}</strong>. Cancela ahora y recibe un reembolso proporcional.
                      </p>
                      <button
                        onClick={handleClaimGuarantee}
                        disabled={managingLoading}
                        style={{
                          padding: '0.625rem 1.25rem',
                          background: managingLoading ? '#D1FAE5' : '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: managingLoading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {managingLoading ? 'Procesando...' : 'Cancelar con reembolso proporcional'}
                      </button>
                    </div>
                  )}
                  <div>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Puedes cancelar en cualquier momento. Seguiras teniendo acceso hasta el fin del periodo de facturacion.
                    </p>
                    <button
                      onClick={handleCancel}
                      disabled={managingLoading}
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'transparent',
                        color: managingLoading ? '#9CA3AF' : '#B91C1C',
                        border: `1px solid ${managingLoading ? '#D1D5DB' : '#FECACA'}`,
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: managingLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {managingLoading ? 'Procesando...' : 'Cancelar suscripcion'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
