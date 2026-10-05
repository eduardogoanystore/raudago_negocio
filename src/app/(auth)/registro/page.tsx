'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { registerNegocioStep1Action } from '@/actions/onboarding';

const INPUT_STYLE: React.CSSProperties = {
  height: 48,
  borderRadius: 12,
  border: '1.5px solid #DED7C9',
  background: '#FFFDFA',
  padding: '0 16px',
  fontSize: 15,
  color: '#121214',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#121214',
  display: 'block',
  marginBottom: 8,
};

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required = true,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={name} style={LABEL_STYLE}>
        {label}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          style={INPUT_STYLE}
        />
      )}
    </div>
  );
}

function capitalizeWords(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

function CapitalizedInput({ name, placeholder }: { name: string; placeholder?: string }) {
  const [value, setValue] = useState('');
  return (
    <input
      id={name}
      name={name}
      type="text"
      placeholder={placeholder}
      required
      autoCapitalize="words"
      value={value}
      onChange={(e) => setValue(capitalizeWords(e.target.value))}
      style={INPUT_STYLE}
    />
  );
}

function RegistroW1Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get('plan') ?? '';
  const interval = searchParams.get('interval') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Client-side validation
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm_password') as string;

    if (!email.includes('@')) {
      setError('Ingresa un correo válido, por ejemplo: tu@correo.com');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres. Agrega más letras o números.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden. Verifica que ambas sean iguales.');
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await registerNegocioStep1Action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    });
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#FFFDFA',
          borderRadius: 24,
          border: '1px solid #DED7C9',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 520,
        }}
      >
        <OnboardingHeader
          step={1}
          title="Registra tu negocio"
          subtitle="3 días gratis · $0 hoy · luego $20/mes por 3 meses · cancela cuando quieras"
        />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {planKey && <input type="hidden" name="_plan" value={planKey} />}
          {interval && <input type="hidden" name="_interval" value={interval} />}
          <Field label="Nombre del negocio" name="business_name" placeholder="Ej. Sushi Kazán" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
            }}
          >
            <Field label="Nombre del dueño" name="owner_first_name">
              <CapitalizedInput name="owner_first_name" placeholder="Eduardo" />
            </Field>
            <Field label="Apellido" name="owner_last_name">
              <CapitalizedInput name="owner_last_name" placeholder="Murrieta" />
            </Field>
          </div>

          <Field label="Correo electrónico" name="email" type="email" placeholder="tu@correo.com" />

          <Field label="Teléfono" name="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="667 000 0000"
              inputMode="numeric"
              maxLength={10}
              pattern="\d{10}"
              required
              title="Ingresa los 10 dígitos de tu teléfono sin espacios ni guiones"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              }}
              style={INPUT_STYLE}
            />
          </Field>

          {/* Password with toggle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="password" style={LABEL_STYLE}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                style={{ ...INPUT_STYLE, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#8E8B93',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm password with toggle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="confirm_password" style={LABEL_STYLE}>
              Confirmar contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu contraseña"
                required
                style={{ ...INPUT_STYLE, paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#8E8B93',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              style={{
                background: '#FFF0F0',
                border: '1px solid #FFCDD2',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                color: '#B00020',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              height: 52,
              borderRadius: 14,
              background: isPending ? '#A08EFF' : '#6C47FF',
              border: 'none',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 700,
              cursor: isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.15s',
            }}
          >
            {isPending ? 'Creando cuenta...' : 'Continuar \u2192'}
          </button>

          <p style={{ fontSize: 13, color: '#8E8B93', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" style={{ color: '#6C47FF', fontWeight: 600 }}>
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function RegistroW1Page() {
  return (
    <Suspense>
      <RegistroW1Content />
    </Suspense>
  );
}
