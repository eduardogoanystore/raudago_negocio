'use client';

import { useState } from 'react';
import { getCaptcha } from '@/utils/captcha';
import { loginBusinessAction } from '@/actions/auth';

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
      {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
    </button>
  );
}

export function LoginForm({ siteKey }: { siteKey: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    // Guardamos el formulario antes de la pausa asíncrona
    const formElement = e.currentTarget;

    try {
      const token = await getCaptcha(siteKey);
      
      // Usamos la constante guardada en lugar de e.currentTarget
      const formData = new FormData(formElement);
      
      const result = await loginBusinessAction(token, formData);
      if (result?.error) setError(result.error);
    } catch (err) {
      // Next.js redirect() throws a special error — keep button disabled until navigation completes
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') return;
      console.error("DEBUG CAPTCHA/LOGIN ERROR:", err);
      setError('Error al verificar. Intenta de nuevo.');
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
          Correo electrónico
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
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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

      <SubmitButton pending={pending} />
    </form>
  );
}
