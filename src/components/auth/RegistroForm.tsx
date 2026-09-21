'use client';

import { useState } from 'react';
import { getCaptcha } from '@/utils/captcha';
import { signupBusinessAction } from '@/actions/auth';

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        padding: '0.75rem',
        background: pending ? 'var(--color-muted)' : 'var(--color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: pending ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {pending ? 'Creando cuenta...' : 'Crear cuenta gratis'}
    </button>
  );
}

export function RegistroForm({ siteKey }: { siteKey: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    if (!accepted) {
      setError('Debes aceptar los Términos y el Aviso de Privacidad para continuar.');
      setPending(false);
      return;
    }
    try {
      const token = await getCaptcha(siteKey);
      const formData = new FormData(e.currentTarget);
      const result = await signupBusinessAction(token, formData);
      if (result?.error) setError(result.error);
    } catch {
      setError('Error al verificar. Intenta de nuevo.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          role="alert"
          style={{
            background: 'var(--color-error, #fee2e2)',
            color: 'var(--color-error-text, #b91c1c)',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label
            htmlFor="first_name"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-foreground)',
              marginBottom: '0.375rem',
            }}
          >
            Nombre
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              border: '1px solid var(--color-border, #e2e8f0)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              background: 'var(--color-background)',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-foreground)',
              marginBottom: '0.375rem',
            }}
          >
            Apellido
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              border: '1px solid var(--color-border, #e2e8f0)',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              background: 'var(--color-background)',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="business_name"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-foreground)',
            marginBottom: '0.375rem',
          }}
        >
          Nombre del negocio
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          autoComplete="organization"
          required
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: 'var(--color-background)',
            color: 'var(--color-foreground)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-foreground)',
            marginBottom: '0.375rem',
          }}
        >
          Correo electronico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: 'var(--color-background)',
            color: 'var(--color-foreground)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="phone"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-foreground)',
            marginBottom: '0.375rem',
          }}
        >
          Telefono <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(opcional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: 'var(--color-background)',
            color: 'var(--color-foreground)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-foreground)',
            marginBottom: '0.375rem',
          }}
        >
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          style={{
            width: '100%',
            padding: '0.625rem 0.75rem',
            border: '1px solid var(--color-border, #e2e8f0)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            background: 'var(--color-background)',
            color: 'var(--color-foreground)',
            boxSizing: 'border-box',
          }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
          Minimo 8 caracteres
        </p>
      </div>

      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
        <input
          id="accept_terms"
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
          style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)', flexShrink: 0 }}
        />
        <label htmlFor="accept_terms" style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
          Acepto los{' '}
          <a href="/terminos" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Términos y Condiciones
          </a>
          {' '}y el{' '}
          <a href="/privacidad" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Aviso de Privacidad
          </a>
          {' '}de RaudaGo.
        </label>
      </div>

      <SubmitButton pending={pending} />
    </form>
  );
}
