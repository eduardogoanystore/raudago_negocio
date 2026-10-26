import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerClient } from '@/graphql/client';
import { EsperaPerfilForm } from '@/components/onboarding/EsperaPerfilForm';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { ReferralCopyButton } from '@/components/onboarding/ReferralCopyButton';

export const metadata = {
  title: 'Tu lugar esta reservado — RaudaGo',
};

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const ESPERA_QUERY = `
  query registroEspera {
    myBusiness {
      slug
      phone
      branches {
        is_primary
        neighborhood
        zone {
          name
          status
          meta_negocios_apertura
          negocios_en_espera
        }
      }
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ZoneData {
  name: string;
  status: string;
  meta_negocios_apertura: number;
  negocios_en_espera: number;
}

interface Branch {
  is_primary: boolean;
  neighborhood: string | null;
  zone: ZoneData | null;
}

interface EsperaBusinessData {
  slug: string;
  phone: string | null;
  branches: Branch[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProgressBar({ actual, meta }: { actual: number; meta: number }) {
  const pct = meta > 0 ? Math.min(100, (actual / meta) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#57544f' }}>
          {actual} de {meta} negocios reservados
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#121214' }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: '#DED7C9',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 999,
            background: pct >= 100 ? '#22C55E' : '#6C47FF',
            transition: 'width 0.3s',
          }}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RegistroEsperaPage() {
  // Verificar token
  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value;
  if (!token) {
    redirect('/login');
  }

  let business: EsperaBusinessData | null = null;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myBusiness: EsperaBusinessData | null }>(ESPERA_QUERY);
    business = data.myBusiness ?? null;
  } catch {
    // Si falla la query pero el token existe, mostrar pantalla genérica sin zona
  }

  const businessSlug =
    business?.slug ?? cookieStore.get('business_slug')?.value ?? '';

  const primaryBranch = business?.branches?.find((b) => b.is_primary) ?? null;
  const zona = primaryBranch?.zone ?? null;
  const neighborhood = primaryBranch?.neighborhood ?? null;
  const businessPhone = business?.phone ?? null;

  // Determinar variante
  const tieneZonaPrelanzamiento = zona && zona.status === 'pre_lanzamiento';
  const sinZona = !zona;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <a href="/" style={{ display: 'inline-block' }}>
            <img src="/logo-full.svg" alt="RaudaGo" style={{ height: 32 }} />
          </a>
        </div>

        {/* ── Sección 1 — Estado de la zona ──────────────────────────────── */}
        <div
          style={{
            background: '#FFFDFA',
            borderRadius: 24,
            border: '1px solid #DED7C9',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <OnboardingHeader
            step={3}
            title="Tu lugar esta reservado"
            subtitle="Sin cobros hasta que tu zona abra."
          />

          {tieneZonaPrelanzamiento ? (
            /* Variante: zona en pre_lanzamiento */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Nombre de zona con badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#121214' }}>
                  {zona!.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#92400E',
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: 999,
                    padding: '2px 10px',
                  }}
                >
                  Pronto
                </span>
              </div>

              {/* Barra de progreso */}
              <ProgressBar
                actual={zona!.negocios_en_espera}
                meta={zona!.meta_negocios_apertura}
              />

              {/* Mensaje de notificacion */}
              <p
                style={{
                  fontSize: 14,
                  color: '#57544f',
                  margin: 0,
                  lineHeight: 1.6,
                  background: '#F3EFE7',
                  borderRadius: 10,
                  padding: '12px 16px',
                }}
              >
                Te avisamos por WhatsApp cuando tu zona abra.
              </p>
            </div>
          ) : sinZona ? (
            /* Variante: sin zona asignada */
            <p
              style={{
                fontSize: 14,
                color: '#57544f',
                margin: 0,
                lineHeight: 1.6,
                background: '#F3EFE7',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              {neighborhood
                ? `${neighborhood} aun no tiene zona asignada. Te avisamos cuando haya cobertura en tu colonia.`
                : 'Tu colonia aun no tiene zona asignada. Te avisamos cuando haya cobertura.'}
            </p>
          ) : null}
        </div>

        {/* ── Sección 2 — Deja tu cuenta lista ─────────────────────────── */}
        <div
          style={{
            background: '#FFFDFA',
            borderRadius: 24,
            border: '1px solid #DED7C9',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#121214',
                margin: 0,
              }}
            >
              Mientras esperas, deja tu cuenta lista
            </h2>
            <p style={{ fontSize: 14, color: '#57544f', margin: 0, lineHeight: 1.5 }}>
              Cuando tu zona abra, podras operar de inmediato.
            </p>
          </div>

          <EsperaPerfilForm initialPhone={businessPhone} />
        </div>

        {/* ── Sección 3 — Referidos ─────────────────────────────────────── */}
        <div
          style={{
            background: '#FFFDFA',
            borderRadius: 24,
            border: '1px solid #DED7C9',
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: '#121214',
                margin: 0,
              }}
            >
              Invita otros negocios de tu zona y abren antes
            </h2>
            <p style={{ fontSize: 14, color: '#57544f', margin: 0, lineHeight: 1.5 }}>
              Cada negocio que se une con tu link acerca la apertura.
            </p>
          </div>

          <ReferralCopyButton businessSlug={businessSlug} />
        </div>
      </div>
    </main>
  );
}
