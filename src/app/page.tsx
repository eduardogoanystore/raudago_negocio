import Image from 'next/image';
import { publicClient } from '@/graphql/client';
import { PlanesSection, SubscriptionPlan } from '@/components/landing/PlanesSection';

const SUBSCRIPTION_PLANS_QUERY = `
  query subscriptionPlans {
    subscriptionPlans(subscriberType: BUSINESS) {
      id
      key
      name
      priceWeeklyCents
      priceMonthlyCents
      priceAnnualCents
      promoPriceCents
      trialDays
      promoMonths
      sortOrder
    }
  }
`;

export default async function LandingPage() {
  let plans: SubscriptionPlan[] = [];
  try {
    const data = await publicClient.request<{ subscriptionPlans: SubscriptionPlan[] }>(
      SUBSCRIPTION_PLANS_QUERY,
    );
    plans = data.subscriptionPlans.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    // Si falla el fetch, planes vacíos — la sección se renderiza vacía
  }

  return (
    <div style={{ background: '#F3EFE7', minHeight: '100vh' }}>

      {/* ── Responsive styles ── */}
      <style>{`
        @keyframes rgPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: .72; }
        }

        /* ── Navbar ── */
        #rg-nav-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-sizing: border-box;
        }
        #rg-nav-links {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* ── Hero ── */
        #rg-hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 80px 24px 96px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          box-sizing: border-box;
        }
        #rg-hero-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 58px;
          font-weight: 700;
          line-height: 1.02;
          letter-spacing: -.04em;
          color: #121214;
        }
        #rg-hero-sub {
          font-size: 20px;
          color: #57544f;
          line-height: 1.6;
        }

        /* ── Problema / Solución ── */
        #rg-problem-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          box-sizing: border-box;
        }

        /* ── Cómo funciona ── */
        #rg-steps-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -.03em;
          color: #121214;
          line-height: 1.1;
        }
        #rg-steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        /* ── Tarifas ── */
        #rg-rates-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
          box-sizing: border-box;
        }
        #rg-rates-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -.03em;
          color: #121214;
          line-height: 1.1;
        }

        /* ── Planes ── */
        #rg-plans-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -.03em;
          color: #121214;
          line-height: 1.1;
          margin-bottom: 16px;
        }
        #rg-plan-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        #rg-plan-flow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          align-items: start;
        }

        /* ── FAQ ── */
        #rg-faq-grid {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 64px;
          box-sizing: border-box;
          align-items: start;
        }
        #rg-faq-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -.03em;
          color: #121214;
          line-height: 1.1;
        }

        /* ── CTA Final ── */
        #rg-cta-title {
          font-family: var(--font-poppins), system-ui, sans-serif;
          font-size: 46px;
          font-weight: 700;
          letter-spacing: -.03em;
          color: #F3EFE7;
          line-height: 1.08;
        }

        /* ────────────────────────────────
           MOBILE — 320px – 430px
        ──────────────────────────────── */
        @media (max-width: 600px) {

          /* Navbar */
          #rg-nav-inner {
            padding: 12px 16px;
          }
          #rg-nav-links a:not([href="/negocio/registro"]) {
            display: none;
          }
          #rg-nav-links a[href="/negocio/registro"] {
            height: 38px;
            padding: 0 16px;
            font-size: 13px;
          }

          /* Hero */
          #rg-hero {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 48px 16px 56px;
          }
          #rg-hero-title {
            font-size: clamp(32px, 9vw, 46px);
          }
          #rg-hero-sub {
            font-size: 17px;
          }

          /* Problema / Solución */
          #rg-problem-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          /* Cómo funciona */
          #rg-steps-title {
            font-size: clamp(28px, 7.5vw, 36px);
          }
          #rg-steps-grid {
            grid-template-columns: 1fr;
          }

          /* Tarifas */
          #rg-rates-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          #rg-rates-title {
            font-size: clamp(26px, 7vw, 34px);
          }

          /* Planes */
          #rg-plans-title {
            font-size: clamp(28px, 7.5vw, 36px);
          }
          #rg-plan-cards {
            grid-template-columns: 1fr;
          }
          #rg-plan-flow {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          /* FAQ */
          #rg-faq-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          #rg-faq-title {
            font-size: clamp(26px, 7vw, 34px);
          }

          /* CTA Final */
          #rg-cta-title {
            font-size: clamp(28px, 8vw, 38px);
          }
        }
      `}</style>

      {/* ── Navbar ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(243,239,231,.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #DED7C9',
        }}
      >
        <div id="rg-nav-inner">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo-full.svg" alt="RaudaGo" width={135} height={48} priority />
          </div>

          {/* Nav links + CTA */}
          <div id="rg-nav-links">
            <a href="#como-funciona" style={{ fontSize: 15, fontWeight: 600, color: '#57544f', padding: '0 6px' }}>
              Cómo funciona
            </a>
            <a href="#tarifas" style={{ fontSize: 15, fontWeight: 600, color: '#57544f', padding: '0 6px' }}>
              Tarifas
            </a>
            <a href="#planes" style={{ fontSize: 15, fontWeight: 600, color: '#57544f', padding: '0 6px' }}>
              Planes
            </a>
            <a
              href="/negocio/registro"
              style={{
                height: 44,
                padding: '0 20px',
                borderRadius: 999,
                background: '#121214',
                color: '#C6FF3D',
                fontSize: 15,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Probar 3 días gratis
            </a>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section id="rg-hero">
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
              3 días gratis · Promo: 3 meses a $20/mes
            </span>
          </div>

          <h1 id="rg-hero-title">
            Tus entregas dejan de vivir en un grupo de WhatsApp.
          </h1>

          <p id="rg-hero-sub">
            Publica el pedido en 15 segundos y el repartidor más cercano lo toma solo. Sin dictar
            direcciones por audio, sin preguntar quién puede, sin perder el hilo de quién lleva qué.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href="/negocio/registro"
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
              Empezar gratis
            </a>
            <a
              href="#como-funciona"
              style={{
                height: 58,
                padding: '0 32px',
                borderRadius: 999,
                background: '#ffffff',
                border: '2px solid #DED7C9',
                color: '#121214',
                fontSize: 17,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Ver cómo funciona
            </a>
          </div>

          <p style={{ fontSize: 14, color: '#57544f' }}>
            3 días gratis · Sin contrato · Cancelas cuando quieras
          </p>
        </div>

        {/* Right — App mockup */}
        <div
          style={{
            background: '#121214',
            borderRadius: 24,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8B93', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              Pedido nuevo
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 15,
                fontWeight: 500,
                color: '#C6FF3D',
                background: 'rgba(198,255,61,.1)',
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              00:14
            </span>
          </div>

          {/* Address */}
          <div
            style={{
              background: 'rgba(255,255,255,.06)',
              borderRadius: 12,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8B93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-8-7.5-8-12a8 8 0 0 1 16 0c0 4.5-8 12-8 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span style={{ fontSize: 15, color: '#F3EFE7', fontWeight: 500 }}>
              Av. Las Torres 1420, Las Quintas
            </span>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#8E8B93', fontWeight: 500, marginBottom: 4 }}>Distancia</div>
              <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 16, fontWeight: 500, color: '#F3EFE7' }}>6.1 km</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#8E8B93', fontWeight: 500, marginBottom: 4 }}>Tarifa</div>
              <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 16, fontWeight: 500, color: '#C6FF3D' }}>$70</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#8E8B93', fontWeight: 500, marginBottom: 4 }}>Elegibles</div>
              <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 16, fontWeight: 500, color: '#F3EFE7' }}>14</div>
            </div>
          </div>

          {/* Publish button */}
          <button
            style={{
              width: '100%',
              height: 52,
              borderRadius: 14,
              background: '#C6FF3D',
              border: 'none',
              color: '#121214',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              animation: 'rgPulse 2.2s ease infinite',
            }}
          >
            Publicar pedido
          </button>

          {/* Driver card */}
          <div
            style={{
              background: 'rgba(255,255,255,.05)',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6C47FF 0%, #C6FF3D 100%)',
                flex: 'none',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F3EFE7' }}>Luis R. lo tomó</div>
              <div style={{ fontSize: 13, color: '#8E8B93', marginTop: 2 }}>a 1.2 km · llega en 6 min</div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#C6FF3D',
                background: 'rgba(198,255,61,.16)',
                padding: '4px 10px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
              }}
            >
              8 s después
            </span>
          </div>

          {/* Caption */}
          <p style={{ fontSize: 13, color: '#8E8B93', lineHeight: 1.5, textAlign: 'center' }}>
            Nadie despacha. El repartidor más cercano y disponible lo toma solo.
          </p>
        </div>
      </section>

      {/* ── Problema / Solución ── */}
      <section
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          borderBottom: '1px solid #DED7C9',
          padding: '80px 24px',
        }}
      >
        <div id="rg-problem-grid">
          {/* Problema */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#FF5A5F',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Como está hoy
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Dictas la dirección por audio y el repartidor la anota mal.',
                'Preguntas "¿quién puede?" y nadie contesta en hora pico.',
                'Negocias el precio del envío cada vez, con cada repartidor.',
                'El cliente llama a preguntar y no sabes qué responderle.',
                'Al final de la semana no cuadra el efectivo con nadie.',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#FF5A5F',
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                      marginTop: 2,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#57544f', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Solución */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#6C47FF',
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Con RaudaGo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Dirección con autocompletado y mapa. Queda escrita.',
                'El pedido llega a los repartidores elegibles de tu zona.',
                'Tarifa fija por distancia. Ves el costo antes de publicar.',
                'Seguimiento en vivo con mapa y tiempo estimado.',
                'Corte semanal con cada pedido, su distancia y su costo.',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#6C47FF',
                      display: 'grid',
                      placeItems: 'center',
                      flex: 'none',
                      marginTop: 2,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#57544f', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section
        id="como-funciona"
        style={{ padding: '96px 24px', maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}
      >
        <div style={{ marginBottom: 56 }}>
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
          <h2 id="rg-steps-title">
            Tres pasos y el pedido va en camino
          </h2>
        </div>

        <div id="rg-steps-grid">
          {[
            {
              num: '01',
              title: 'Llenas el pedido',
              desc: 'Dirección con buscador, datos del cliente y notas. El sistema calcula la distancia y te dice el costo exacto antes de publicar.',
            },
            {
              num: '02',
              title: 'Un repartidor lo toma',
              desc: 'Se publica a los repartidores verificados que están cerca y disponibles. El primero que lo toma se lo queda — en segundos, no en minutos.',
            },
            {
              num: '03',
              title: 'Lo sigues hasta la puerta',
              desc: 'Mapa en vivo, tiempo estimado y contacto del repartidor. Cuando el cliente llame, ya sabes qué responderle.',
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                background: '#FFFDFA',
                border: '1px solid #DED7C9',
                borderRadius: 18,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#6C47FF',
                  letterSpacing: '.06em',
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-poppins), system-ui, sans-serif',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#121214',
                  lineHeight: 1.2,
                  letterSpacing: '-.02em',
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: 16, color: '#57544f', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tarifas ── */}
      <section
        id="tarifas"
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          borderBottom: '1px solid #DED7C9',
          padding: '96px 24px',
        }}
      >
        <div id="rg-rates-grid">
          {/* Left text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
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
                Tarifas por entrega
              </div>
              <h2 id="rg-rates-title">
                El mismo precio para todos, siempre
              </h2>
            </div>
            <p style={{ fontSize: 17, color: '#57544f', lineHeight: 1.65 }}>
              No negociamos tarifa con ningún repartidor ni con ningún negocio. La distancia determina el costo y lo ves antes de publicar. Sin sorpresas al final del día.
            </p>

            {/* Callout box */}
            <div
              style={{
                background: '#F3EFE7',
                borderRadius: 14,
                padding: '20px 22px',
                border: '1px solid #DED7C9',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#121214',
                  marginBottom: 10,
                  letterSpacing: '.01em',
                }}
              >
                Cinco formas de cobrar
              </div>
              <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.6 }}>
                Efectivo, transferencia, pago en línea, cobro al cliente o ya pagado. Tú eliges pedido por pedido y el sistema lo registra.
              </p>
            </div>
          </div>

          {/* Right — Rate table */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #DED7C9' }}>
            {/* Header */}
            <div
              style={{
                background: '#121214',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                padding: '14px 20px',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8B93', letterSpacing: '.04em', textTransform: 'uppercase' }}>Distancia</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8B93', letterSpacing: '.04em', textTransform: 'uppercase' }}>Tarifa</span>
            </div>

            {/* Rows */}
            {[
              { range: '0.1 – 3.4 km', price: '$50', highlight: true },
              { range: '3.5 – 4.4 km', price: '$55' },
              { range: '4.5 – 5.4 km', price: '$60' },
              { range: '5.5 – 6.4 km', price: '$65' },
              { range: '6.5 – 7.4 km', price: '$70' },
              { range: '7.5 – 8.4 km', price: '$75' },
              { range: '8.5 – 9.4 km', price: '$80' },
              { range: '9.5 – 10.4 km', price: '$85' },
              { range: '10.5 – 11.4 km', price: '$90' },
              { range: '11.5 – 12.4 km', price: '$95' },
              { range: '12.5 – 13.4 km', price: '$100' },
            ].map((row, i) => (
              <div
                key={row.range}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  padding: '12px 20px',
                  background: i % 2 === 0 ? '#F3EFE7' : '#FFFDFA',
                  borderBottom: '1px solid #E5E0D8',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 15,
                    color: '#57544f',
                  }}
                >
                  {row.range}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 16,
                    fontWeight: 500,
                    color: row.highlight ? '#4B2FD6' : '#121214',
                  }}
                >
                  {row.price}
                </span>
              </div>
            ))}

            {/* Footer */}
            <div style={{ padding: '14px 20px', background: '#F3EFE7' }}>
              <span style={{ fontSize: 13, color: '#57544f', lineHeight: 1.5 }}>
                Arriba de 13.4 km se suman $5 por kilómetro. Sin cargos sorpresa.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <PlanesSection plans={plans} />

      {/* ── FAQ ── */}
      <section
        style={{
          background: '#FFFDFA',
          borderTop: '1px solid #DED7C9',
          padding: '96px 24px',
        }}
      >
        <div id="rg-faq-grid">
          {/* Left */}
          <h2 id="rg-faq-title">
            Preguntas frecuentes
          </h2>

          {/* Right — Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {[
              {
                q: '¿Los repartidores son de RaudaGo?',
                a: 'No, trabajan por cuenta propia. RaudaGo los verifica, los conecta con tu pedido y registra cada entrega. Ellos deciden cuándo conectarse y qué pedidos tomar.',
              },
              {
                q: '¿Quién paga el envío, yo o mi cliente?',
                a: 'Tú decides pedido por pedido. Puedes absorberlo, cobrárselo al cliente o dividirlo. El sistema lo registra de la forma que elijas.',
              },
              {
                q: '¿Y el efectivo que cobra el repartidor?',
                a: 'Es tu dinero y nunca pasa por nuestras cuentas. El repartidor lo recibe en la entrega y te lo liquida directamente según el acuerdo que tengan.',
              },
              {
                q: '¿Cuánta gente de mi equipo puede usarlo?',
                a: '3 usuarios en Starter y 10 en Pro. Cada uno con su acceso y permisos independientes. No se comparte contraseña.',
              },
              {
                q: '¿Necesito contrato?',
                a: 'No. Es prepago semanal: dejas de pagar y el servicio se pausa. Sin penalizaciones, sin avisos previos, sin burocracia.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                style={{
                  paddingBottom: 28,
                  borderBottom: '1px solid #E5E0D8',
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 700, color: '#121214', marginBottom: 10 }}>
                  {faq.q}
                </div>
                <p style={{ fontSize: 16, color: '#57544f', lineHeight: 1.65 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section
        id="registro"
        style={{
          background: '#121214',
          padding: '96px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            textAlign: 'center',
          }}
        >
          <h2 id="rg-cta-title">
            Tu próximo pedido puede salir en 15 segundos
          </h2>

          <p style={{ fontSize: 18, color: '#8E8B93', lineHeight: 1.6 }}>
            Regístrate, prueba tres días y decide después. Culiacán primero; seguimos con el resto de Sinaloa.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/negocio/registro"
              style={{
                height: 58,
                padding: '0 36px',
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
              Crear mi cuenta
            </a>
            <a
              href="https://wa.me/526672277437?text=Hola%2C%20me%20interesa%20RaudaGo%20para%20mi%20negocio.%20%C2%BFMe%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                height: 58,
                padding: '0 36px',
                borderRadius: 999,
                background: 'transparent',
                border: '2px solid #2A2A31',
                color: '#F3EFE7',
                fontSize: 17,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              Hablar con alguien
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: '#121214',
          borderTop: '1px solid #2A2A31',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            boxSizing: 'border-box',
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

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <a href="/terminos" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
              Términos
            </a>
            <a href="/privacidad" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
              Privacidad
            </a>
            <a href="/codigo-conducta" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
              Conducta
            </a>
            <a href="/repartidor" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
              Soy repartidor
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
