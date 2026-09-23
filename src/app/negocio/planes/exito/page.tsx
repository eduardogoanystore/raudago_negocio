import { getMySubscription } from '@/actions/subscription';
import { SetSubscriptionCookie } from '@/components/subscription/SetSubscriptionCookie';
import { SubscriptionPolling } from '@/components/subscription/SubscriptionPolling';
import Link from 'next/link';

interface SearchParams {
  session_id?: string;
}

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await searchParams; // session_id available if needed for logging

  const subscription = await getMySubscription();
  const isActive = subscription && ['ACTIVE', 'TRIALING'].includes(subscription.status);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6C47FF' }}>
            Rauda<span style={{ color: '#121214' }}>Go</span>
          </span>
        </div>

        {isActive ? (
          /* Suscripcion ya activa — mostrar exito inmediatamente */
          <div style={{ textAlign: 'center' }}>
            <SetSubscriptionCookie />
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.75rem',
                color: '#166534',
              }}
            >
              ✓
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#121214',
                marginBottom: '0.5rem',
              }}
            >
              ¡Suscripcion activada!
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              Ya tienes acceso a{' '}
              <strong style={{ color: '#121214' }}>
                {subscription.subscription_plan.name}
              </strong>
              .
            </p>
            {subscription.status === 'TRIALING' && (
              <p style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                Estas en tu periodo de prueba gratuito.
              </p>
            )}
            <div style={{ marginTop: '2rem' }}>
              <Link
                href="/negocio/"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  background: '#6C47FF',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                }}
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        ) : (
          /* Suscripcion pendiente — delegar polling al cliente */
          <SubscriptionPolling />
        )}
      </div>
    </main>
  );
}
