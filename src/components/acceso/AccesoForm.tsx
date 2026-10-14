'use client';

import { useState } from 'react';

interface AccesoFormProps {
  ref_: string;
}

type Field = 'nombre' | 'giro' | 'telefono' | 'zona' | 'pedidos';

export function AccesoForm({ ref_ }: AccesoFormProps) {
  const [nombre, setNombre] = useState('');
  const [giro, setGiro] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('');
  const [pedidos, setPedidos] = useState('');
  const [comoEntrega, setComoEntrega] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [touched, setTouched] = useState<Set<Field>>(new Set());

  function touch(field: Field) {
    setTouched((prev) => new Set(prev).add(field));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Mark all required fields touched on submit
    setTouched(new Set(['nombre', 'giro', 'telefono', 'zona', 'pedidos']));

    setLoading(true);
    try {
      const res = await fetch('/api/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          giro,
          telefono,
          zona,
          pedidos,
          comoEntrega,
          ref: ref_,
          website, // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Algo salió mal. Inténtalo de nuevo.');
        return;
      }

      setDone(true);
    } catch {
      setError('Error de conexión. Revisa tu internet e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (done) {
    return (
      <div
        style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 20,
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          textAlign: 'center',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(108,71,255,.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <div>
          <div
            style={{
              fontFamily: 'var(--font-poppins), system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#121214',
              letterSpacing: '-.02em',
              marginBottom: 10,
            }}
          >
            ¡Listo, {nombre}!
          </div>
          <p style={{ fontSize: 16, color: '#57544f', lineHeight: 1.65 }}>
            Te avisamos por WhatsApp en cuanto haya acceso disponible en tu zona. Normalmente tardamos menos de 48 horas en contactarte.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: '#FFFDFA',
        border: '1px solid #DED7C9',
        borderRadius: 20,
        padding: '36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        maxWidth: 520,
        margin: '0 auto',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Honeypot — oculto */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      {/* Nombre del negocio */}
      <Field
        label="Nombre del negocio"
        required
        touched={touched.has('nombre')}
        empty={!nombre.trim()}
      >
        <input
          type="text"
          placeholder="Ej. Taquería El Gordo"
          value={nombre}
          onChange={(e) => {
              const v = e.target.value;
              setNombre(v ? v[0].toUpperCase() + v.slice(1) : v);
            }}
          onBlur={() => touch('nombre')}
          maxLength={120}
          style={inputStyle}
        />
      </Field>

      {/* Giro */}
      <Field
        label="Giro del negocio"
        required
        touched={touched.has('giro')}
        empty={!giro.trim()}
      >
        <input
          type="text"
          placeholder="Ej. Comida, farmacia, ropa, floristería…"
          value={giro}
          onChange={(e) => setGiro(e.target.value)}
          onBlur={() => touch('giro')}
          maxLength={120}
          style={inputStyle}
        />
      </Field>

      {/* Teléfono */}
      <Field
        label="Teléfono (WhatsApp)"
        required
        touched={touched.has('telefono')}
        empty={!telefono.trim()}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <span
            style={{
              height: 48,
              padding: '0 14px',
              borderRadius: 10,
              border: '1px solid #DED7C9',
              background: '#F3EFE7',
              display: 'flex',
              alignItems: 'center',
              fontSize: 15,
              color: '#57544f',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            +52
          </span>
          <input
            type="tel"
            placeholder="667 000 0000"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, 10))}
            onBlur={() => touch('telefono')}
            maxLength={10}
            inputMode="numeric"
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      </Field>

      {/* Zona / Colonia */}
      <Field
        label="Colonia o zona"
        required
        touched={touched.has('zona')}
        empty={!zona.trim()}
      >
        <input
          type="text"
          placeholder="Ej. Las Quintas, Centro, Chapultepec…"
          value={zona}
          onChange={(e) => setZona(e.target.value)}
          onBlur={() => touch('zona')}
          maxLength={120}
          style={inputStyle}
        />
      </Field>

      {/* Pedidos al día */}
      <Field
        label="¿Cuántos pedidos haces al día? (aprox.)"
        required
        touched={touched.has('pedidos')}
        empty={pedidos === ''}
      >
        <input
          type="number"
          placeholder="Ej. 15"
          value={pedidos}
          onChange={(e) => setPedidos(e.target.value)}
          onBlur={() => touch('pedidos')}
          min={0}
          step={1}
          style={inputStyle}
        />
      </Field>

      {/* Cómo hace entregas hoy — opcional */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
          ¿Cómo haces hoy tus entregas?{' '}
          <span style={{ fontSize: 13, color: '#8E8B93', fontWeight: 400 }}>opcional</span>
        </label>
        <textarea
          placeholder="Grupo de WhatsApp, repartidores propios, aplicación, a pie…"
          value={comoEntrega}
          onChange={(e) => setComoEntrega(e.target.value)}
          maxLength={500}
          rows={3}
          style={{
            ...inputStyle,
            height: 'auto',
            resize: 'vertical',
            paddingTop: 12,
            paddingBottom: 12,
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            fontSize: 14,
            color: '#B91C1C',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 10,
            padding: '12px 16px',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          height: 52,
          borderRadius: 999,
          background: loading ? '#9B8BDF' : '#6C47FF',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background .15s',
        }}
      >
        {loading ? 'Enviando…' : 'Solicitar acceso'}
      </button>

      <p style={{ fontSize: 13, color: '#8E8B93', textAlign: 'center', lineHeight: 1.5 }}>
        Sin compromiso. Te contactamos por WhatsApp para confirmarte disponibilidad.
      </p>
    </form>
  );
}

// ── Small helper components ───────────────────────────────────────────────────

function Field({
  label,
  required,
  touched,
  empty,
  children,
}: {
  label: string;
  required?: boolean;
  touched: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  const showError = required && touched && empty;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
        {label}
        {required && <span style={{ color: '#6C47FF', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {showError && (
        <span style={{ fontSize: 13, color: '#B91C1C' }}>Este campo es requerido.</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 48,
  borderRadius: 10,
  border: '1px solid #DED7C9',
  background: '#FFFDFA',
  padding: '0 14px',
  fontSize: 15,
  color: '#121214',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};
