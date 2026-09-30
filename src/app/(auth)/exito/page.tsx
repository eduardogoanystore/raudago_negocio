import { cookies } from 'next/headers';
import { getServerClient } from '@/graphql/client';

export const metadata = {
  title: 'Bienvenido a RaudaGo',
};

const MY_BUSINESS_QUERY = `
  query myBusiness {
    myBusiness {
      id
      name
      slug
    }
  }
`;

export default async function NegocioExitoPage() {
  const cookieStore = await cookies();
  const accountId = cookieStore.get('business_account_id')?.value;

  let businessName: string | null = null;
  let businessSlug: string | null = null;

  // Try to fetch personalized data — non-fatal if it fails
  try {
    const client = await getServerClient();
    const data = await client.request<{
      myBusiness: { id: string; name: string; slug: string } | null;
    }>(MY_BUSINESS_QUERY);
    if (data.myBusiness) {
      businessName = data.myBusiness.name;
      businessSlug = data.myBusiness.slug;
    }
  } catch {
    // Non-fatal — show generic welcome
  }

  const panelHref = businessSlug
    ? `/${businessSlug}/`
    : '/';

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#FFFDFA',
          borderRadius: 24,
          border: '1px solid #DED7C9',
          padding: '56px 40px',
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#6C47FF',
            letterSpacing: '-0.03em',
            textDecoration: 'none',
          }}
        >
          Rauda<span style={{ color: '#121214' }}>Go</span>
        </a>

        {/* Check */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#C6FF3D',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#121214"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#121214',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {businessName
              ? `\u00a1Bienvenido a RaudaGo, ${businessName}!`
              : '\u00a1Bienvenido a RaudaGo!'}
          </h1>
          <p style={{ fontSize: 16, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
            Tu periodo de prueba ha comenzado.{' '}
            Empieza a crear pedidos y conecta a tus repartidores desde el panel.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: '#DED7C9' }} />

        {/* What's next */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            textAlign: 'left',
          }}
        >
          {[
            'Crea tu primer pedido en segundos',
            'Invita a tu equipo y repartidores',
            'Monitorea entregas en tiempo real',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#F1EDFF',
                  display: 'grid',
                  placeItems: 'center',
                  flex: 'none',
                }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6C47FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <span style={{ fontSize: 14, color: '#57544f' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={panelHref}
          style={{
            height: 52,
            borderRadius: 14,
            background: '#6C47FF',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          Ir a mi panel \u2192
        </a>
      </div>
    </main>
  );
}
