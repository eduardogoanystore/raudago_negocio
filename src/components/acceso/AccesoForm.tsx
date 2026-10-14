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
    const shareText = encodeURIComponent(
      '¡Regístrate en RaudaGo para automatizar tus entregas en Culiacán! Es gratis para empezar 👇\nhttps://negocio.raudago.com/acceso?ref=referido'
    );
    const shareUrl = `https://wa.me/?text=${shareText}`;
    const contactUrl = 'https://wa.me/526672277437?text=' + encodeURIComponent('Hola, me registré en la lista de espera de RaudaGo y quiero saber más.');

    return (
      <div
        style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 20,
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          maxWidth: 520,
          margin: '0 auto',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Encabezado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div
            style={{
              fontFamily: 'var(--font-poppins), system-ui, sans-serif',
              fontSize: 24,
              fontWeight: 700,
              color: '#121214',
              letterSpacing: '-.02em',
              lineHeight: 1.2,
            }}
          >
            ¡Listo, {nombre}! Ya estás en la lista 🎉
          </div>
          <p style={{ fontSize: 16, color: '#57544f', lineHeight: 1.65, margin: 0 }}>
            Tu negocio quedó registrado para la zona <strong style={{ color: '#121214' }}>{zona}</strong>.
          </p>
        </div>

        {/* Qué sigue */}
        <div
          style={{
            background: '#F3EFE7',
            borderRadius: 14,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6C47FF', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            ¿Qué sigue?
          </div>
          {[
            'Estamos abriendo Culiacán por zonas y con pocos negocios al inicio, para que el servicio funcione bien desde el primer día.',
            'Antes de abrir tu zona te escribimos por WhatsApp para confirmar tu lugar y explicarte tu plan.',
            'Si vas empezando o haces pocos envíos, podrás usar RaudaGo gratis. Los negocios fundadores con más envíos tendrán días gratis y precio especial.',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#6C47FF',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </div>
              <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.6, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Compartir */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#121214' }}>
            ¿Quieres que tu zona abra antes?
          </div>
          <p style={{ fontSize: 14, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
            Mientras más negocios de tu zona se registren, antes la abrimos. Comparte el enlace con otros negocios que hagan envíos:
          </p>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 50,
              borderRadius: 999,
              background: '#25D366',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartir por WhatsApp
          </a>

          <a
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              borderRadius: 999,
              background: 'transparent',
              border: '1px solid #DED7C9',
              color: '#57544f',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Escríbenos por WhatsApp
          </a>
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
          onChange={(e) => { const v = e.target.value; setGiro(v ? v[0].toUpperCase() + v.slice(1) : v); }}
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
          onChange={(e) => { const v = e.target.value; setZona(v ? v[0].toUpperCase() + v.slice(1) : v); }}
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
          onChange={(e) => { const v = e.target.value; setComoEntrega(v ? v[0].toUpperCase() + v.slice(1) : v); }}
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
