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
    mySubscription {
      trialEnd
      plan {
        name
        isFree
        maxOrdersWeekly
        trialDays
        priceWeeklyCents
        promoPriceCents
        promoWeeks
      }
    }
  }
`;

export default async function NegocioExitoPage() {
  const cookieStore = await cookies();
  const accountId = cookieStore.get('business_account_id')?.value;

  let businessName: string | null = null;
  let businessSlug: string | null = null;
  let isFree = false;
  let maxOrdersWeekly: number | null = null;
  let planName: string | null = null;
  let trialDays = 7;
  let priceWeeklyCents = 0;
  let promoPriceCents: number | null = null;
  let promoWeeks: number | null = null;
  let trialEnd: string | null = null;

  // Try to fetch personalized data — non-fatal if it fails
  try {
    const client = await getServerClient();
    const data = await client.request<{
      myBusiness: { id: string; name: string; slug: string } | null;
      mySubscription: {
        trialEnd: string | null;
        plan: {
          name: string;
          isFree: boolean;
          maxOrdersWeekly: number | null;
          trialDays: number;
          priceWeeklyCents: number;
          promoPriceCents: number | null;
          promoWeeks: number | null;
        };
      } | null;
    }>(MY_BUSINESS_QUERY);
    if (data.myBusiness) {
      businessName = data.myBusiness.name;
      businessSlug = data.myBusiness.slug;
    }
    const sub = data.mySubscription;
    isFree = sub?.plan?.isFree ?? false;
    maxOrdersWeekly = sub?.plan?.maxOrdersWeekly ?? null;
    planName = sub?.plan?.name ?? null;
    trialDays = sub?.plan?.trialDays ?? 7;
    priceWeeklyCents = sub?.plan?.priceWeeklyCents ?? 0;
    promoPriceCents = sub?.plan?.promoPriceCents ?? null;
    promoWeeks = sub?.plan?.promoWeeks ?? null;
    trialEnd = sub?.trialEnd ?? null;
  } catch {
    // Non-fatal — show generic welcome
  }

  const panelHref = businessSlug ? `/${businessSlug}/` : '/';

  // Fecha de primer cobro: usar trialEnd de la suscripción si existe, si no calcular desde hoy
  const firstChargeDate = trialEnd
    ? new Date(trialEnd)
    : (() => { const d = new Date(); d.setDate(d.getDate() + trialDays); return d; })();
  const firstChargeLabel = firstChargeDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

  // Precio a mostrar: promo si existe, si no precio semanal normal
  const displayPriceCents = promoPriceCents ?? priceWeeklyCents;
  const displayPrice = `$${(displayPriceCents / 100).toLocaleString('es-MX')}/semana`;
  const promoLabel = promoWeeks ? ` por ${promoWeeks} semanas` : '';

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
        <a href="/">
          <img src="/logo-full.svg" alt="RaudaGo" style={{ height: 36 }} />
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
            {isFree
              ? 'Ya estás listo para operar. Publica tu primer pedido y el repartidor más cercano lo toma al instante.'
              : 'Tu periodo de prueba ha comenzado. Publica tu primer pedido y el repartidor más cercano lo toma.'}
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: '#DED7C9' }} />

        {/* Card plan Arranque */}
        {isFree && (
          <div
            style={{
              width: '100%',
              background: '#F1EDFF',
              border: '1px solid #C4B5FD',
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#6C47FF',
                flex: 'none',
                marginTop: 4,
                boxShadow: '0 0 0 3px #C4B5FD',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#121214' }}>
                Plan Arranque · Gratis
              </span>
              <span style={{ fontSize: 13, color: '#57544f', lineHeight: 1.5 }}>
                {maxOrdersWeekly
                  ? `Hasta ${maxOrdersWeekly} pedidos por semana sin costo. Cuando crezcas, cambia de plan desde Facturación.`
                  : 'Sin costo. Cuando crezcas, cambia de plan desde Facturación.'}
              </span>
            </div>
          </div>
        )}

        {/* Trial status card — solo para planes de pago */}
        {!isFree && (
          <div
            style={{
              width: '100%',
              background: '#F6FFDC',
              border: '1px solid #C6FF3D',
              borderRadius: 14,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#4CAF50',
                flex: 'none',
                boxShadow: '0 0 0 3px #C6FF3D',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#121214' }}>
                {planName ? `Plan ${planName}` : 'Trial'} · {trialDays} días gratis
              </span>
              <span style={{ fontSize: 13, color: '#57544f' }}>
                Primer cobro el {firstChargeLabel} · <strong style={{ color: '#121214' }}>{displayPrice}{promoLabel}</strong> · cancela cuando quieras
              </span>
            </div>
          </div>
        )}

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
            'Publica un pedido en menos de 15 segundos',
            'El repartidor más cercano lo toma solo',
            'Sigue la entrega en tiempo real desde el panel',
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
          Publicar mi primer pedido →
        </a>
      </div>
    </main>
  );
}
