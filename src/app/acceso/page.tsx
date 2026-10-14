import Image from 'next/image';
import { AccesoForm } from '@/components/acceso/AccesoForm';

export const metadata = {
  title: 'Solicitar acceso — RaudaGo para Negocios',
  description:
    'Únete a la lista de espera de RaudaGo. Automatiza tus entregas y conecta con repartidores verificados en tu zona.',
};

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

export default async function AccesoPage({ searchParams }: Props) {
  const params = await searchParams;
  const ref = (params.ref ?? 'directo').trim().slice(0, 100) || 'directo';

  return (
    <div style={{ background: '#F3EFE7', minHeight: '100vh' }}>

      <style>{`
        @media (max-width: 600px) {
          #ac-hero { padding: 48px 16px 40px !important; }
          #ac-hero h1 { font-size: clamp(28px, 8vw, 38px) !important; }
          #ac-wrap { padding: 0 16px 56px !important; }
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
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          <a href="https://www.raudago.com" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo-full.svg" alt="RaudaGo" width={120} height={43} priority />
          </a>
        </div>
      </div>

      {/* ── Hero text ── */}
      <section
        id="ac-hero"
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '64px 24px 48px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(108,71,255,.1)',
              color: '#4B2FD6',
              fontSize: 13,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 999,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B2FD6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Lista de espera
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-poppins), system-ui, sans-serif',
            fontSize: 46,
            fontWeight: 700,
            color: '#121214',
            lineHeight: 1.05,
            letterSpacing: '-.04em',
            marginBottom: 20,
          }}
        >
          Automatiza tus entregas
        </h1>

        <p style={{ fontSize: 18, color: '#57544f', lineHeight: 1.7, marginBottom: 0 }}>
          Conecta con repartidores verificados de tu zona. Publica un pedido en 15 segundos y el repartidor más cercano lo toma solo. Sin grupos de WhatsApp, sin negociar tarifas.
        </p>
      </section>

      {/* ── Form ── */}
      <section
        id="ac-wrap"
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '0 24px 72px',
          boxSizing: 'border-box',
        }}
      >
        <AccesoForm ref_={ref} />
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: '#121214',
          borderTop: '1px solid #2A2A31',
          padding: '24px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            boxSizing: 'border-box',
          }}
        >
          <span style={{ fontSize: 14, color: '#57545C' }}>© 2025 RaudaGo · Culiacán, Sinaloa</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="https://www.raudago.com/terminos" style={{ fontSize: 14, color: '#8E8B93' }}>
              Términos
            </a>
            <a href="https://www.raudago.com/privacidad" style={{ fontSize: 14, color: '#8E8B93' }}>
              Privacidad
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
