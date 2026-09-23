import { getPlans, getMySubscription } from '@/actions/subscription';
import { PlanSelector } from '@/components/subscription/PlanSelector';

interface SearchParams {
  cancelled?: string;
  plan?: string;
  interval?: string;
}

export default async function PlanesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const cancelled = params.cancelled === 'true';
  const initialPlanId = params.plan;
  const initialInterval = params.interval;

  const [plans, currentSubscription] = await Promise.all([
    getPlans('BUSINESS'),
    getMySubscription(),
  ]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <a
            href="/negocio/"
            style={{
              display: 'inline-block',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#6C47FF',
              letterSpacing: '-0.03em',
              marginBottom: '1rem',
            }}
          >
            Rauda<span style={{ color: '#121214' }}>Go</span>
          </a>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#121214',
              marginBottom: '0.5rem',
            }}
          >
            Elige tu plan
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            Accede a todas las funciones de RaudaGo para tu negocio
          </p>
        </div>

        {/* Cancelled banner */}
        {cancelled && (
          <div
            role="alert"
            style={{
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A',
              borderRadius: '0.75rem',
              padding: '0.875rem 1.25rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}
          >
            Cancelaste el proceso de pago. Puedes intentarlo de nuevo cuando quieras.
          </div>
        )}

        {/* Current subscription banner */}
        {currentSubscription &&
          ['ACTIVE', 'TRIALING'].includes(currentSubscription.status) && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '0.75rem',
                padding: '0.875rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                color: '#166534',
                textAlign: 'center',
              }}
            >
              Plan actual:{' '}
              <strong>{currentSubscription.subscription_plan.name}</strong>
              {currentSubscription.status === 'TRIALING' && ' (periodo de prueba)'}
              {currentSubscription.cancelAtPeriodEnd && ' — se cancela al fin del periodo'}
            </div>
          )}

        <PlanSelector
          plans={plans}
          currentSubscription={currentSubscription}
          initialPlanId={initialPlanId}
          initialInterval={initialInterval}
        />
      </div>
    </main>
  );
}
