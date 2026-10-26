'use client';

import { useActionState, useTransition } from 'react';
import { updateBusinessProfileAction, type UpdateBusinessProfileState } from '@/actions/business';

const INPUT_STYLE: React.CSSProperties = {
  borderRadius: 12,
  border: '1.5px solid #DED7C9',
  background: '#FFFDFA',
  padding: '10px 16px',
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

interface Props {
  initialPhone?: string | null;
}

export function EsperaPerfilForm({ initialPhone }: Props) {
  const [state, formAction] = useActionState<UpdateBusinessProfileState | null, FormData>(
    updateBusinessProfileAction,
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

  // Si ya guardó con éxito, mostrar confirmación
  if (state?.success) {
    return (
      <div
        style={{
          background: '#DCFCE7',
          border: '1px solid #86EFAC',
          borderRadius: 14,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 15,
          color: '#166534',
          fontWeight: 600,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Datos guardados. Tu cuenta ya esta lista para operar cuando abra tu zona.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Descripcion del negocio */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="espera-description" style={LABEL_STYLE}>
          Descripcion corta del negocio{' '}
          <span style={{ fontWeight: 400, color: '#8E8B93' }}>(opcional)</span>
        </label>
        <textarea
          id="espera-description"
          name="description"
          placeholder='Ej. "Tacos artesanales, cocina casera desde 2018"'
          maxLength={200}
          rows={3}
          style={{
            ...INPUT_STYLE,
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
        <span style={{ fontSize: 12, color: '#8E8B93', marginTop: 5 }}>
          Maxima 200 caracteres.
        </span>
      </div>

      {/* WhatsApp de contacto — solo se muestra si no tiene */}
      {!initialPhone && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="espera-phone" style={LABEL_STYLE}>
            WhatsApp de contacto{' '}
            <span style={{ fontWeight: 400, color: '#8E8B93' }}>(opcional)</span>
          </label>
          <input
            id="espera-phone"
            name="phone"
            type="tel"
            placeholder="667 000 0000"
            inputMode="numeric"
            maxLength={10}
            pattern="\d{10}"
            title="Ingresa los 10 digitos de tu telefono sin espacios ni guiones"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            }}
            style={INPUT_STYLE}
          />
        </div>
      )}

      {/* Horario */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="espera-schedule" style={LABEL_STYLE}>
          Horario de atencion{' '}
          <span style={{ fontWeight: 400, color: '#8E8B93' }}>(opcional)</span>
        </label>
        <input
          id="espera-schedule"
          name="schedule"
          type="text"
          placeholder='Ej. "Lun-Vie 9am-6pm, Sabado 10am-3pm"'
          maxLength={120}
          style={INPUT_STYLE}
        />
      </div>

      {/* Error */}
      {state?.error && (
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
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          height: 48,
          borderRadius: 12,
          background: isPending ? '#A08EFF' : '#6C47FF',
          border: 'none',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: isPending ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
      >
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
