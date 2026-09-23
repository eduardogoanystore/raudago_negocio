'use client';

import Image from 'next/image';
import { useState } from 'react';

// Cambiar a 'store' cuando la app esté en las tiendas
const CTA_MODE: 'form' | 'store' = 'form';

const trialDays = '10 días';
const promoPrice = '$40';
const promoLength = '6 semanas';
const normalPrice = '$150';

const ZONES = ['Centro', 'Tres Ríos', 'Humaya', 'Las Quintas', 'La Primavera', 'Otra'];
const VEHICLES = ['Moto', 'Auto', 'Bici'];

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
    a: 'Por eso empiezas gratis los primeros 10 días. Si en ese tiempo no ves un volumen que valga la pena, no pagas nada y sin complicaciones.',
  },
  {
    q: '¿Cuánto cobro por pedido?',
    a: 'Depende de los km: $50 hasta 3.4 km y $5 más por cada kilómetro adicional, hasta $100 a 13.4 km. Lo ves en la pantalla antes de aceptar, siempre.',
  },
];

export default function RepartidorLanding() {
  const [zone, setZone] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<string>('Moto');
  const [openFaq, setOpenFaq] = useState<number>(-1);
  const [sent, setSent] = useState<boolean>(false);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div style={{ background: '#F3EFE7', minHeight: '100vh' }}>

      {/* ── Responsive styles ── */}
      <style>{`
        #rep-hero-grid  { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px; }
        #rep-how-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
        #rep-vs-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        #rep-offer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
        #rep-reg-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px; }
        @media (max-width: 600px) {
          #rep-hero-title  { font-size: clamp(34px, 9vw, 54px) !important; }
          #rep-offer-title { font-size: clamp(28px, 7vw, 40px) !important; }
        }
      `}</style>

      {/* ── Nav sticky ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(243,239,231,.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #DED7C9',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxSizing: 'border-box',
          }}
        >
          {/* Logo + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo-full.svg" alt="RaudaGo" width={120} height={42} priority />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#8E8B93',
                paddingLeft: 10,
                borderLeft: '1px solid #DED7C9',
              }}
            >
              Repartidores
            </span>
          </div>

          {/* CTA */}
          <div style={{ marginLeft: 'auto' }}>
            <a
              href="#registro"
              style={{
                height: 42,
                padding: '0 20px',
                borderRadius: 999,
                background: '#6C47FF',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Regístrate gratis
            </a>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '80px 24px 96px',
          boxSizing: 'border-box',
        }}
      >
        <div id="rep-hero-grid" style={{ alignItems: 'center' }}>

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Badge */}
            <div style={{ display: 'inline-flex' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#C6FF3D',
                  color: '#121214',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: 999,
                  letterSpacing: '.01em',
                }}
              >
                Culiacán · {trialDays} gratis
              </span>
            </div>

            <h1
              id="rep-hero-title"
              style={{
                fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                fontSize: 54,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: '-.04em',
                color: '#121214',
                margin: 0,
              }}
            >
              Todos los pedidos de Culiacán en un solo lugar. Y sabes cuánto cobras antes de aceptar.
            </h1>

            <p style={{ fontSize: 19, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
              Un solo app. Ves el precio, la distancia y el destino antes de decir que sí. Sin regatear, sin sorpresas, sin dictar nada por audio.
            </p>

            <div>
              <a
                href="#registro"
                style={{
                  height: 58,
                  padding: '0 32px',
                  borderRadius: 999,
                  background: '#6C47FF',
                  color: '#ffffff',
                  fontSize: 17,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                Quiero repartir con RaudaGo →
              </a>
            </div>

            <p style={{ fontSize: 14, color: '#8E8B93', margin: 0 }}>
              Sin dejar tu grupo actual · Sin tarjeta para empezar
            </p>
          </div>

          {/* Right — image placeholder + card */}
          <div style={{ position: 'relative' }}>
            {/* Main image */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4/5',
                maxHeight: 580,
                borderRadius: 28,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/images/repartidor.png"
                alt="Repartidor RaudaGo en moto"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center center' }}
                priority
              />
            </div>

            {/* Floating dark card */}
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: -16,
                background: '#121214',
                borderRadius: 18,
                padding: '16px 20px',
                minWidth: 240,
                boxShadow: '0 12px 40px rgba(0,0,0,.28)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                Pedido disponible
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#F3EFE7', marginBottom: 8 }}>
                Sushi Kazán → Las Quintas
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#C6FF3D',
                  marginBottom: 10,
                }}
              >
                $75
              </div>
              <div style={{ fontSize: 13, color: '#8E8B93' }}>
                7.8 km · tú cobras esto
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          borderBottom: '1px solid #DED7C9',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 48 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#6C47FF',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Cómo funciona
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-.03em',
                color: '#121214',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Cuatro pasos y ya estás repartiendo
            </h2>
          </div>

          <div id="rep-how-grid">
            {[
              {
                bg: '#F3EFE7',
                dark: false,
                num: '1.',
                title: 'Te registras',
                desc: 'Nombre, WhatsApp y zona. Sin trámites largos, sin contrato. Listo en menos de 2 minutos.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                ),
              },
              {
                bg: '#F3EFE7',
                dark: false,
                num: '2.',
                title: 'Ves todos los pedidos',
                desc: 'Cada pedido muestra el negocio, el destino, la distancia y lo que cobras. Antes de tocar nada.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                ),
              },
              {
                bg: '#F3EFE7',
                dark: false,
                num: '3.',
                title: 'Tomas el que te convenga',
                desc: 'Aceptas solo lo que vale tu tiempo. Sin presiones, sin turnos forzados, sin tener que responder rápido en un chat.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                ),
              },
              {
                bg: '#C6FF3D',
                dark: true,
                num: '4.',
                title: 'Cobras lo que ya viste',
                desc: 'Sin regateos al llegar. El precio que viste en la app es el que cobras, siempre.',
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.num}
                style={{
                  background: card.bg,
                  borderRadius: 20,
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  border: card.dark ? 'none' : '1px solid #DED7C9',
                }}
              >
                <div>{card.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                    fontSize: 20,
                    fontWeight: 700,
                    color: card.dark ? '#121214' : '#121214',
                    letterSpacing: '-.02em',
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {card.num} {card.title}
                </h3>
                <p style={{ fontSize: 15, color: card.dark ? '#3a3a3a' : '#57544f', lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hoy vs. RaudaGo ── */}
      <section
        style={{
          padding: '96px 24px',
          maxWidth: 1180,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-poppins), system-ui, sans-serif',
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '-.03em',
              color: '#121214',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            El grupo de WhatsApp vs. RaudaGo
          </h2>
        </div>

        <div id="rep-vs-grid">
          {/* Hoy */}
          <div
            style={{
              background: '#FFFDFA',
              border: '1px solid #DED7C9',
              borderRadius: 20,
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#8E8B93',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              Hoy, en el grupo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'No sabes cuánto te pagan antes de aceptar',
                'Tienes que responder rápido o alguien más se lo lleva',
                'Negocias el precio cada vez con cada negocio',
                'El historial se pierde entre audios y stickers',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#E5E0D8',
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                      marginTop: 2,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8E8B93" strokeWidth="3" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#57544f', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RaudaGo */}
          <div
            style={{
              background: '#121214',
              borderRadius: 20,
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#C6FF3D',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              Con RaudaGo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Precio, distancia y destino visibles antes de aceptar',
                'Sin presión: tomas el pedido cuando quieres',
                'Tarifa fija por kilómetro, la misma para todos',
                'Historial completo de cada entrega en la app',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#C6FF3D',
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                      marginTop: 2,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#DED7C9', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Oferta ── */}
      <section
        style={{
          background: '#6C47FF',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>

          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,.6)',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Precio de lanzamiento
            </div>
            <h2
              id="rep-offer-title"
              style={{
                fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-.03em',
                color: '#ffffff',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Empieza gratis. Paga menos mientras la plataforma crece.
            </h2>
          </div>

          <div id="rep-offer-grid" style={{ marginBottom: 40 }}>
            {/* PASO 1 */}
            <div
              style={{
                background: '#C6FF3D',
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4B2FD6', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                PASO 1
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#121214',
                  letterSpacing: '-.04em',
                  lineHeight: 1,
                }}
              >
                Gratis
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#121214' }}>
                Los primeros {trialDays}
              </div>
              <p style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.6, margin: 0 }}>
                Sin tarjeta, sin compromiso. Entra, ve los pedidos y decide si vale la pena.
              </p>
            </div>

            {/* PASO 2 */}
            <div
              style={{
                background: '#FFFDFA',
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                border: '1px solid rgba(255,255,255,.2)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6C47FF', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                PASO 2
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#121214',
                  letterSpacing: '-.04em',
                  lineHeight: 1,
                }}
              >
                {promoPrice}<span style={{ fontSize: 16, fontWeight: 600, color: '#57544f' }}>/semana</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#121214' }}>
                Durante {promoLength}
              </div>
              <p style={{ fontSize: 14, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
                Precio de lanzamiento para los primeros repartidores que se suman.
              </p>
            </div>

            {/* PASO 3 */}
            <div
              style={{
                background: '#121214',
                borderRadius: 20,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                PASO 3
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#F3EFE7',
                  letterSpacing: '-.04em',
                  lineHeight: 1,
                }}
              >
                {normalPrice}<span style={{ fontSize: 16, fontWeight: 600, color: '#8E8B93' }}>/semana</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#DED7C9' }}>
                Lo mismo que ya pagas hoy
              </div>
              <p style={{ fontSize: 14, color: '#8E8B93', lineHeight: 1.6, margin: 0 }}>
                El precio normal cuando la plataforma esté consolidada. Igual a lo que cobran los grupos hoy.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="#registro"
              style={{
                height: 58,
                padding: '0 40px',
                borderRadius: 999,
                background: '#C6FF3D',
                color: '#121214',
                fontSize: 17,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Empezar mis {trialDays} gratis
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          padding: '96px 24px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: '-.03em',
                color: '#121214',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Preguntas frecuentes
            </h2>
          </div>

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
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#121214',
                        lineHeight: 1.4,
                      }}
                    >
                      {faq.q}
                    </span>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#6C47FF',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
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
        </div>
      </section>

      {/* ── Registro ── */}
      <section
        id="registro"
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          padding: '96px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <div id="rep-reg-grid" style={{ alignItems: 'start' }}>

            {/* Left text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 42,
                  fontWeight: 700,
                  letterSpacing: '-.04em',
                  color: '#121214',
                  lineHeight: 1.08,
                  margin: 0,
                }}
              >
                Empieza a ver pedidos hoy mismo.
              </h2>
              <p style={{ fontSize: 18, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
                {trialDays} gratis, sin tarjeta, sin dejar tu grupo actual. Entra, revisa cómo se ve la app y decide si quieres seguir.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Ves precio y destino antes de aceptar',
                  'Tarifa fija, sin regateos',
                  'Sin contrato, cancelas cuando quieras',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#C6FF3D',
                        display: 'grid',
                        placeItems: 'center',
                        flex: 'none',
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 15, color: '#57544f' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form or store */}
            <div
              style={{
                background: '#F3EFE7',
                borderRadius: 24,
                padding: '36px 32px',
              }}
            >
              {CTA_MODE === 'form' ? (
                sent ? (
                  /* Success state */
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 20,
                      textAlign: 'center',
                      padding: '24px 0',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: '#C6FF3D',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#121214',
                        margin: 0,
                        letterSpacing: '-.02em',
                      }}
                    >
                      Listo, ya estás en la lista.
                    </h3>
                    <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
                      Te vamos a contactar por WhatsApp en las próximas horas para darte acceso a la app.
                    </p>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#121214',
                        margin: 0,
                        letterSpacing: '-.02em',
                      }}
                    >
                      Regístrate gratis
                    </h3>

                    {/* Nombre */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{
                          height: 48,
                          borderRadius: 12,
                          border: '1.5px solid #DED7C9',
                          background: '#FFFDFA',
                          padding: '0 16px',
                          fontSize: 15,
                          color: '#121214',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    {/* WhatsApp */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="667 000 0000"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        style={{
                          height: 48,
                          borderRadius: 12,
                          border: '1.5px solid #DED7C9',
                          background: '#FFFDFA',
                          padding: '0 16px',
                          fontSize: 15,
                          color: '#121214',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    {/* Zona */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
                        ¿Por dónde andas más?
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {ZONES.map((z) => {
                          const active = zone === z;
                          return (
                            <button
                              key={z}
                              type="button"
                              onClick={() => setZone(active ? null : z)}
                              style={{
                                height: 36,
                                padding: '0 14px',
                                borderRadius: 999,
                                border: active ? '2px solid #6C47FF' : '1px solid #DED7C9',
                                background: active ? '#F1EDFF' : '#FFFDFA',
                                color: active ? '#4B2FD6' : '#121214',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              {z}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vehículo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: '#121214' }}>
                        Vehículo
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {VEHICLES.map((v) => {
                          const active = vehicle === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setVehicle(v)}
                              style={{
                                height: 44,
                                borderRadius: 12,
                                border: active ? '2px solid #6C47FF' : '1px solid #DED7C9',
                                background: active ? '#F1EDFF' : '#FFFDFA',
                                color: active ? '#4B2FD6' : '#121214',
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      style={{
                        height: 52,
                        borderRadius: 14,
                        background: '#6C47FF',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Regístrate gratis
                    </button>

                    {/* Legal */}
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
                )
              ) : (
                /* Store mode */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#121214',
                      margin: 0,
                      letterSpacing: '-.02em',
                    }}
                  >
                    Descarga la app y regístrate ahí
                  </h3>
                  <p style={{ fontSize: 15, color: '#57544f', margin: 0, lineHeight: 1.6 }}>
                    Disponible en App Store y Google Play.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    <a
                      href="#app-store"
                      style={{
                        height: 52,
                        borderRadius: 14,
                        background: '#121214',
                        color: '#ffffff',
                        fontSize: 15,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19c-2.3 2.4-5.2 2.4-7 0s-1.8-6 0-9.6c.9-1.8 2.2-2.4 3-2.4 1 0 1.5.5 3 .5s2-.5 3-.5c.8 0 2.1.6 3 2.4" />
                        <path d="M12 4a2 2 0 0 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>
                      App Store
                    </a>
                    <a
                      href="#google-play"
                      style={{
                        height: 52,
                        borderRadius: 14,
                        background: '#121214',
                        color: '#ffffff',
                        fontSize: 15,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      Google Play
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: '#121214',
          borderTop: '1px solid #2A2A31',
          padding: '56px 24px 40px',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            boxSizing: 'border-box',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
          }}
        >
          {/* Logo + location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/icon.svg" alt="RaudaGo" width={30} height={30} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#F3EFE7',
                  letterSpacing: '-.02em',
                }}
              >
                RaudaGo
              </div>
              <div style={{ fontSize: 12, color: '#8E8B93', marginTop: 1 }}>Culiacán, Sinaloa</div>
            </div>
          </div>

          {/* Contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
              Contacto
            </div>
            <a
              href="https://wa.me/526672277437"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}
            >
              WhatsApp 667 227 7437
            </a>
            <a
              href="mailto:repartidores@raudago.mx"
              style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}
            >
              repartidores@raudago.mx
            </a>
          </div>

          {/* Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>
              Legal
            </div>
            <a href="/terminos" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Términos</a>
            <a href="/privacidad" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Privacidad</a>
            <a href="/codigo-conducta" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Código de Conducta</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 1180,
            margin: '40px auto 0',
            boxSizing: 'border-box',
            paddingTop: 24,
            borderTop: '1px solid #2A2A31',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: '#57544f' }}>© 2026 RaudaGo</span>
          <a href="/" style={{ fontSize: 13, color: '#8E8B93', fontWeight: 500 }}>
            ¿Tienes un negocio? Conoce RaudaGo Negocios
          </a>
        </div>
      </footer>

    </div>
  );
}
