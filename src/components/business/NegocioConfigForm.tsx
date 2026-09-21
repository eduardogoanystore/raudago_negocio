'use client';

import { useActionState, useTransition } from 'react';
import { updateProfileAction, type UpdateProfileActionState } from '@/actions/business';

interface BusinessData {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  zone: { id: string; name: string } | null;
}

interface AccountData {
  first_name: string;
  last_name: string;
  phone: string | null;
}

interface NegocioConfigFormProps {
  negocio_slug: string;
  business: BusinessData;
  account: AccountData;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid var(--color-border)',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  background: 'var(--color-background)',
  color: 'var(--color-foreground)',
  outline: 'none',
};

const readonlyInputStyle: React.CSSProperties = {
  ...inputStyle,
  background: '#F9FAFB',
  color: 'var(--color-muted)',
  cursor: 'not-allowed',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--color-muted)',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '1rem',
};

export default function NegocioConfigForm({
  negocio_slug,
  business,
  account,
}: NegocioConfigFormProps) {
  const boundAction = updateProfileAction.bind(null, negocio_slug);
  const [state, formAction] = useActionState<UpdateProfileActionState | null, FormData>(
    boundAction,
    null,
  );
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div>
      {/* Banner de éxito */}
      {state?.success && (
        <div style={{
          background: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          color: '#065F46',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}>
          Cambios guardados correctamente.
        </div>
      )}

      {/* Banner de error */}
      {state?.error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid var(--color-alert)',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          color: 'var(--color-alert)',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}>
          {state.error}
        </div>
      )}

      {/* Datos del negocio (readonly) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--color-muted)',
          marginBottom: '1rem',
          padding: '0.6rem 0.75rem',
          background: '#FFFBEB',
          border: '1px solid #F59E0B',
          borderRadius: '0.5rem',
        }}>
          El nombre, email y dirección del negocio solo pueden modificarse a través de soporte. Contacta a <strong>soporte@raudago.mx</strong> para solicitar cambios.
        </p>
        <div style={gridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre del negocio</label>
            <input
              type="text"
              value={business.name}
              readOnly
              style={readonlyInputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email de contacto</label>
            <input
              type="email"
              value={business.email ?? '—'}
              readOnly
              style={readonlyInputStyle}
            />
          </div>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Dirección</label>
            <input
              type="text"
              value={business.address ?? '—'}
              readOnly
              style={readonlyInputStyle}
            />
          </div>
        </div>
      </div>

      {/* Divisor */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '1.5rem' }} />

      {/* Datos de la cuenta (editables) */}
      <p style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--color-foreground)',
        marginBottom: '1rem',
      }}>
        Datos de tu cuenta
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ ...gridStyle, marginBottom: '1.25rem' }}>
          <div style={fieldStyle}>
            <label htmlFor="first_name" style={labelStyle}>Nombre</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              defaultValue={account.first_name}
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="last_name" style={labelStyle}>Apellido</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              defaultValue={account.last_name}
              required
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label htmlFor="phone" style={labelStyle}>Teléfono de contacto</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={account.phone ?? ''}
              placeholder="Ej. 6671234567"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            background: isPending ? 'var(--color-muted)' : 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.65rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
