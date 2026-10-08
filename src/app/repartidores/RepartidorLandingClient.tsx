'use client';

import { useState } from 'react';

const VEHICLES = ['Moto', 'Auto', 'Bici'];

export function FaqSection() {
  const FAQS = [
    {
      q: '¿Tengo que dejar mi grupo de WhatsApp?',
      a: 'No. Puedes probar RaudaGo sin dejar nada. Muchos repartidores usan ambos al principio y terminan prefiriendo la app porque ven el precio antes de aceptar.',
    },
    {
      q: '¿Necesito vehículo propio?',
      a: 'Sí: moto, auto o bici. Lo que importa es que seas tú quien lo conduce y que puedas moverte dentro de Culiacán.',
    },
    {
      q: '¿Cómo y cuándo me pagan los pedidos?',
      a: 'Directo a ti. El negocio o el cliente te paga en efectivo o transferencia al momento de la entrega. RaudaGo no retiene ni distribuye el dinero.',
    },
    {
      q: '¿Y si no tengo pedidos suficientes?',
      a: 'Por eso empiezas gratis los primeros 7 días. Si en ese tiempo no ves un volumen que valga la pena, no pagas nada y sin complicaciones.',
    },
    {
      q: '¿Cuánto cobro por pedido?',
      a: 'Depende de los km: $50 hasta 3.4 km y $5 más por cada kilómetro adicional, hasta $100 a 13.4 km. Lo ves en la pantalla antes de aceptar, siempre.',
    },
  ];

  const [openFaq, setOpenFaq] = useState<number>(-1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FAQS.map((faq, i) => {
        const isOpen = openFaq === i;
        return (
          <div
            key={i}
            style={{
              background: '#FFFDFA',
              border: '1px solid #DED7C9',
              borderRadius: 18,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenFaq(isOpen ? -1 : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '20px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#121214', lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <div
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#6C47FF', display: 'grid', placeItems: 'center', flex: 'none',
                }}
              >
                {isOpen ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                )}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '0 24px 20px' }}>
                <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.65, margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RegistroForm({ zones }: { zones: string[] }) {
  const [zone, setZone] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<string>('Moto');
  const [sent, setSent] = useState<boolean>(false);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', padding: '24px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#C6FF3D', display: 'grid', placeItems: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 22, fontWeight: 700, color: '#121214', margin: 0, letterSpacing: '-.02em' }}>
          Listo, ya estás en la lista.
        </h3>
        <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
          Te vamos a contactar por WhatsApp en las próximas horas para darte acceso a la app.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: '#121214', margin: 0, letterSpacing: '-.02em' }}>
        Regístrate gratis
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>Nombre</label>
        <input
          type="text"
          required
          placeholder="Tu nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ height: 48, borderRadius: 12, border: '1.5px solid #DED7C9', background: '#FFFDFA', padding: '0 16px', fontSize: 15, color: '#121214', outline: 'none', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>WhatsApp</label>
        <input
          type="tel"
          required
          placeholder="667 000 0000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          style={{ height: 48, borderRadius: 12, border: '1.5px solid #DED7C9', background: '#FFFDFA', padding: '0 16px', fontSize: 15, color: '#121214', outline: 'none', fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>¿Por dónde andas más?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {zones.map((z) => {
            const active = zone === z;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setZone(active ? null : z)}
                style={{
                  height: 36, padding: '0 14px', borderRadius: 999,
                  border: active ? '2px solid #6C47FF' : '1px solid #DED7C9',
                  background: active ? '#F1EDFF' : '#FFFDFA',
                  color: active ? '#4B2FD6' : '#121214',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {z}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>Vehículo</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {VEHICLES.map((v) => {
            const active = vehicle === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVehicle(v)}
                style={{
                  height: 44, borderRadius: 12,
                  border: active ? '2px solid #6C47FF' : '1px solid #DED7C9',
                  background: active ? '#F1EDFF' : '#FFFDFA',
                  color: active ? '#4B2FD6' : '#121214',
                  fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        style={{ height: 52, borderRadius: 14, background: '#6C47FF', border: 'none', color: '#ffffff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
      >
        Regístrate gratis
      </button>

      <p style={{ fontSize: 12, color: '#8E8B93', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
        Al registrarte aceptas nuestros{' '}
        <a href="/terminos" style={{ color: '#6C47FF', fontWeight: 600 }}>Términos</a>
        {', '}
        <a href="/privacidad" style={{ color: '#6C47FF', fontWeight: 600 }}>Privacidad</a>
        {' y '}
        <a href="/codigo-conducta" style={{ color: '#6C47FF', fontWeight: 600 }}>Código de Conducta</a>
        .
      </p>
    </form>
  );
}
