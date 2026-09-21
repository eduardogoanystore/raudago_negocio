'use client';

import { useActionState, useState } from 'react';
import { acceptInvitationAction } from '@/actions/employees';

interface Props {
  token: string;
  email: string;
  role: string;
}

const ROLE_LABELS: Record<string, string> = {
  owner:   'Dueno',
  manager: 'Encargado',
  staff:   'Cajero',
  counter: 'Contador',
};

export function AcceptInvitationForm({ token, email, role }: Props) {
  const boundAction = acceptInvitationAction.bind(null, token);
  const [state, formAction, isPending] = useActionState(boundAction, null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function handleSubmit(formData: FormData) {
    if (password !== confirmPassword) {
      setPasswordError('Las contrasenas no coinciden');
      return;
    }
    setPasswordError('');
    formAction(formData);
  }

  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '1rem',
        padding: '2rem',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Rauda<span style={{ color: 'var(--color-foreground)' }}>Go</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>Activa tu cuenta</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Has sido invitado como <strong>{roleLabel}</strong>
          </p>
        </div>

        {state?.error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: '#B91C1C',
          }}>
            {state.error}{' '}
            <a href="/negocio/login" style={{ color: '#6C47FF', fontWeight: 600 }}>
              Ir al login
            </a>
          </div>
        )}

        <form action={handleSubmit}>
          {/* Email (readonly) */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Correo electronico
            </label>
            <input
              type="email"
              name="email"
              value={email}
              readOnly
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                background: 'var(--color-background)',
                color: 'var(--color-muted)',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Contrasena
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Confirmar contrasena
            </label>
            <input
              type="password"
              name="confirm_password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                border: `1px solid ${passwordError ? 'var(--color-alert)' : 'var(--color-border)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            {passwordError && (
              <p style={{ color: 'var(--color-alert)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: isPending ? 'var(--color-border)' : 'var(--color-primary)',
              color: isPending ? 'var(--color-muted)' : 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Activando...' : 'Activar cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
