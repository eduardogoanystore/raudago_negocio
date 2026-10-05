'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';
import { resendVerificationEmailAction } from '@/actions/auth';

const ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

const VERIFY_EMAIL = `
  mutation verifyEmail($token: String!, $user_type: String!) {
    verifyEmail(token: $token, user_type: $user_type)
  }
`;

// ─── Styles ────────────────────────────────────────────────────────────────

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#F3EFE7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px 80px',
  boxSizing: 'border-box',
};

const cardStyle: React.CSSProperties = {
  background: '#FFFDFA',
  borderRadius: 24,
  border: '1px solid #DED7C9',
  padding: '48px 36px',
  width: '100%',
  maxWidth: 480,
  textAlign: 'center',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: 800,
  color: '#6C47FF',
  letterSpacing: '-0.04em',
  marginBottom: '2rem',
  display: 'block',
};

const headingStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 700,
  color: '#121214',
  margin: '0 0 0.5rem',
};

const bodyStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  color: '#8E8B93',
  margin: '0 0 1.75rem',
  lineHeight: 1.6,
};

const primaryBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.7rem 1.75rem',
  background: '#6C47FF',
  color: '#ffffff',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: '0.95rem',
  textDecoration: 'none',
  transition: 'background 0.15s',
};

const ghostBtnStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.7rem 1.75rem',
  background: 'transparent',
  color: '#6C47FF',
  borderRadius: 12,
  fontWeight: 700,
  fontSize: '0.95rem',
  textDecoration: 'none',
  border: '1.5px solid #6C47FF',
};

// ─── Icons ─────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto 1.25rem' }}
      aria-hidden="true"
    >
      <circle cx="28" cy="28" r="28" fill="#6C47FF" fillOpacity="0.1" />
      <path
        d="M17 28.5L24 35.5L39 20"
        stroke="#6C47FF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto 1.25rem' }}
      aria-hidden="true"
    >
      <circle cx="28" cy="28" r="28" fill="#B00020" fillOpacity="0.08" />
      <path
        d="M20 20L36 36M36 20L20 36"
        stroke="#B00020"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '3px solid #DED7C9',
        borderTopColor: '#6C47FF',
        margin: '0 auto 1.25rem',
        animation: 'spin 0.8s linear infinite',
      }}
      aria-label="Verificando..."
      role="status"
    />
  );
}

// ─── Inner component (reads search params) ─────────────────────────────────

type VerifyState = 'loading' | 'success' | 'error' | 'no_token';

function VerificarEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<VerifyState>(token ? 'loading' : 'no_token');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [panelHref, setPanelHref] = useState<string>('/');
  const [resendSent, setResendSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)business_slug=([^;]+)/);
    if (match) {
      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL ?? '';
      setPanelHref(`${portalUrl}/${match[1]}/`);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      const client = new GraphQLClient(ENDPOINT);
      try {
        const data = await client.request<{ verifyEmail: boolean }>(
          VERIFY_EMAIL,
          { token, user_type: 'business' }
        );
        if (!cancelled) {
          if (data.verifyEmail === true) {
            setState('success');
          } else {
            setErrorMsg('El enlace ya fue usado o expiró.');
            setState('error');
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const gqlErr = err as { response?: { errors?: { message: string }[] } };
          const msg =
            gqlErr?.response?.errors?.[0]?.message ??
            'No pudimos verificar tu correo. El enlace puede haber expirado.';
          setErrorMsg(msg);
          setState('error');
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div style={wrapperStyle}>
      {/* Spinner keyframe injected inline — avoids a CSS file dependency */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={cardStyle}>
        <span style={logoStyle}>
          Rauda<span style={{ color: '#121214' }}>Go</span>
        </span>

        {state === 'loading' && (
          <>
            <Spinner />
            <h1 style={headingStyle}>Verificando tu correo…</h1>
            <p style={bodyStyle}>Solo un momento, estamos confirmando tu cuenta.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckIcon />
            <h1 style={headingStyle}>Tu correo fue verificado</h1>
            <p style={bodyStyle}>
              Tu cuenta está activa. Ya puedes iniciar sesión y empezar a usar RaudaGo.
            </p>
            <a href={panelHref} style={primaryBtnStyle}>
              Ir a mi panel
            </a>
          </>
        )}

        {state === 'no_token' && (
          <>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ display: 'block', margin: '0 auto 1.25rem' }}>
              <circle cx="28" cy="28" r="28" fill="#6C47FF" fillOpacity="0.08" />
              <path d="M14 20h28v18H14z" stroke="#6C47FF" strokeWidth="2" strokeLinejoin="round" fill="none" />
              <path d="M14 20l14 11 14-11" stroke="#6C47FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 style={headingStyle}>Verifica tu correo</h1>
            <p style={bodyStyle}>
              Te enviamos un enlace de verificación. Revisa tu bandeja de entrada y la carpeta de spam.
            </p>
            {resendSent ? (
              <p style={{ fontSize: '0.9rem', color: '#6C47FF', fontWeight: 600 }}>
                Correo reenviado. Revisa tu bandeja.
              </p>
            ) : (
              <button
                onClick={() => startTransition(async () => { await resendVerificationEmailAction(); setResendSent(true); })}
                disabled={isPending}
                style={{
                  ...primaryBtnStyle,
                  background: isPending ? '#A08EFF' : '#6C47FF',
                  cursor: isPending ? 'default' : 'pointer',
                  border: 'none',
                  fontFamily: 'inherit',
                }}
              >
                {isPending ? 'Enviando...' : 'Reenviar correo'}
              </button>
            )}
          </>
        )}

        {state === 'error' && (
          <>
            <ErrorIcon />
            <h1 style={{ ...headingStyle, color: '#B00020' }}>No pudimos verificar tu correo</h1>
            <p style={bodyStyle}>{errorMsg}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/registro" style={ghostBtnStyle}>
                Volver al registro
              </a>
              <a href="/login" style={primaryBtnStyle}>
                Ir al login
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page export — wrapped in Suspense to avoid prerender error ─────────────

export default function VerificarEmailNegocioPage() {
  return (
    <Suspense
      fallback={
        <div style={wrapperStyle}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={cardStyle}>
            <span style={logoStyle}>
              Rauda<span style={{ color: '#121214' }}>Go</span>
            </span>
            <Spinner />
            <p style={bodyStyle}>Cargando…</p>
          </div>
        </div>
      }
    >
      <VerificarEmailContent />
    </Suspense>
  );
}
