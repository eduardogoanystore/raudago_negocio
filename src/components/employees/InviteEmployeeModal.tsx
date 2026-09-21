'use client';

import { useState, useActionState } from 'react';
import { inviteMemberAction } from '@/actions/employees';

const ROLES = [
  { value: 'manager', label: 'Encargado', description: 'Acceso total excepto facturacion' },
  { value: 'staff',   label: 'Cajero',    description: 'Crear y seguir pedidos' },
  { value: 'counter', label: 'Contador',  description: 'Solo lectura' },
];

const ROLE_CONFIG: Record<string, { color: string; bg: string }> = {
  manager: { color: '#0284C7', bg: '#E0F2FE' },
  staff:   { color: '#059669', bg: '#D1FAE5' },
  counter: { color: '#6B7280', bg: '#F3F4F6' },
};

export function InviteEmployeeModal({ negocio_slug }: { negocio_slug: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  const boundAction = inviteMemberAction.bind(null, negocio_slug);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  function handleClose() {
    setOpen(false);
    setStep(1);
    setRole('');
    setEmail('');
  }

  function handleOpen() {
    setOpen(true);
    setStep(1);
    setRole('');
    setEmail('');
  }

  const selectedRole = ROLES.find((r) => r.value === role);

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.6rem 1.25rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Invitar empleado
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: '1rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Invitar empleado</h2>
              <button
                onClick={handleClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--color-muted)' }}
              >
                ×
              </button>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{
                  height: '4px',
                  flex: 1,
                  borderRadius: '2px',
                  background: n <= step ? 'var(--color-primary)' : 'var(--color-border)',
                }} />
              ))}
            </div>

            {/* Step 1 — Rol */}
            {step === 1 && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                  Selecciona el rol del empleado
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {ROLES.map((r) => {
                    const cfg = ROLE_CONFIG[r.value];
                    const selected = role === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0.875rem 1rem',
                          borderRadius: '0.75rem',
                          border: selected ? `2px solid ${cfg.color}` : '2px solid var(--color-border)',
                          background: selected ? cfg.bg : 'var(--color-surface)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: selected ? cfg.color : 'var(--color-foreground)' }}>
                          {r.label}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                          {r.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!role}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: role ? 'var(--color-primary)' : 'var(--color-border)',
                    color: role ? 'white' : 'var(--color-muted)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: role ? 'pointer' : 'not-allowed',
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}

            {/* Step 2 — Email */}
            {step === 2 && (
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>
                  Correo electronico del empleado
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="empleado@ejemplo.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    marginBottom: '1rem',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--color-surface)',
                      color: 'var(--color-foreground)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  >
                    Atras
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!email}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: email ? 'var(--color-primary)' : 'var(--color-border)',
                      color: email ? 'white' : 'var(--color-muted)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      cursor: email ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Confirmacion */}
            {step === 3 && (
              <div>
                {/* Si ya se envio con exito */}
                {state?.success ? (
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#065F46' }}>
                      Invitacion enviada correctamente
                    </p>
                    {state.invitation_token && (
                      <div style={{
                        background: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        marginBottom: '1rem',
                      }}>
                        <p style={{ fontSize: '0.8rem', color: '#15803D', marginBottom: '0.5rem', fontWeight: 600 }}>
                          Comparte este enlace con tu empleado:
                        </p>
                        <p style={{
                          fontSize: '0.8rem',
                          color: '#065F46',
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          background: '#DCFCE7',
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                        }}>
                          {typeof window !== 'undefined' ? window.location.origin : ''}/negocio/aceptar-invitacion?token={state.invitation_token}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleClose}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <form action={formAction}>
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="role" value={role} />

                    <div style={{
                      background: 'var(--color-background)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      marginBottom: '1rem',
                    }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>Resumen</p>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        Invitar a <strong>{email}</strong> como{' '}
                        <strong>{selectedRole?.label ?? role}</strong>
                      </p>
                    </div>

                    {state?.error && (
                      <div style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '0.5rem',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        fontSize: '0.85rem',
                        color: '#B91C1C',
                      }}>
                        {state.error}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'var(--color-surface)',
                          color: 'var(--color-foreground)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '0.5rem',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                        }}
                      >
                        Atras
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: isPending ? 'var(--color-border)' : 'var(--color-primary)',
                          color: isPending ? 'var(--color-muted)' : 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          cursor: isPending ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isPending ? 'Enviando...' : 'Enviar invitacion'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
