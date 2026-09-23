'use client';

import { useState, useEffect } from 'react';
import { getMySubscription, UserSubscription } from '@/actions/subscription';
import { SetSubscriptionCookie } from './SetSubscriptionCookie';
import Link from 'next/link';

const MAX_ATTEMPTS = 5; // 5 x 2s = 10s total
const POLL_INTERVAL_MS = 2000;

function SuccessView({ subscription }: { subscription: UserSubscription }) {
  return (
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
  );
}

export function SubscriptionPolling() {
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling || attempts >= MAX_ATTEMPTS) {
      if (attempts >= MAX_ATTEMPTS) setPolling(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const sub = await getMySubscription();
        if (sub && ['ACTIVE', 'TRIALING'].includes(sub.status)) {
          setActiveSub(sub);
          setPolling(false);
          return;
        }
      } catch {
        // continue polling
      }
      setAttempts((a) => a + 1);
    }, POLL_INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [attempts, polling]);

  if (activeSub) {
    return <SuccessView subscription={activeSub} />;
  }

  if (!polling) {
    // Timeout — show fallback message
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#121214',
            marginBottom: '0.75rem',
          }}
        >
          Procesando tu suscripcion
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Tu pago esta siendo procesado. Puede tardar unos minutos mas. Revisa tu correo y vuelve pronto.
        </p>
        <Link
          href="/negocio/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#6C47FF',
            color: 'white',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Polling in progress
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '3rem',
          height: '3rem',
          border: '3px solid #E5E0D8',
          borderTopColor: '#6C47FF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1.5rem',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
        Confirmando tu suscripcion...
      </p>
    </div>
  );
}
