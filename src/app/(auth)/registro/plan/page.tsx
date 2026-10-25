import { cookies } from 'next/headers';
import { getPlans } from '@/actions/subscription';
import { getServerClient } from '@/graphql/client';
import { OnboardingPlanSelector } from '@/components/onboarding/OnboardingPlanSelector';
import { ZonaEsperaView } from '@/components/onboarding/ZonaEsperaView';

export const metadata = {
  title: 'Elige tu plan — RaudaGo',
};

const MY_BUSINESS_QUERY = `
  query myBusinessWithZone {
    myBusiness {
      name
      slug
      branches {
        is_primary
        neighborhood
        city_id
        zone {
          id
          name
          status
          meta_negocios_apertura
          meta_repartidores_apertura
          negocios_en_espera
          repartidores_en_espera
        }
      }
    }
  }
`;

interface ZoneData {
  id: string;
  name: string;
  status: string;
  meta_negocios_apertura: number;
  meta_repartidores_apertura: number;
  negocios_en_espera: number;
  repartidores_en_espera: number;
}

interface Branch {
  is_primary: boolean;
  neighborhood: string | null;
  city_id: string | null;
  zone: ZoneData | null;
}

interface MyBusiness {
  name: string;
  slug: string;
  branches: Branch[];
}

export default async function RegistroPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const [plans, params] = await Promise.all([getPlans('BUSINESS'), searchParams]);

  let businessName: string | undefined;
  let businessSlug: string | undefined;
  let primaryBranch: Branch | null = null;
  let zona: ZoneData | null = null;
  let hasSinCobertura = false;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myBusiness: MyBusiness | null }>(MY_BUSINESS_QUERY);
    businessName = data.myBusiness?.name ?? undefined;
    businessSlug = data.myBusiness?.slug ?? undefined;

    // Buscar zona de la sucursal principal
    primaryBranch = data.myBusiness?.branches?.find((b) => b.is_primary) ?? null;
    zona = primaryBranch?.zone ?? null;

    // Si la sucursal principal existe pero no tiene zona, es sin_cobertura
    if (primaryBranch && !primaryBranch.zone) {
      hasSinCobertura = true;
    }
  } catch {
    // No fatal — si falla, seguimos con el flujo normal de planes
  }

  // Leer slug desde cookie como fallback si la query no lo devolvió aún
  if (!businessSlug) {
    const cookieStore = await cookies();
    businessSlug = cookieStore.get('business_slug')?.value ?? '';
  }

  // ── Variante sin_cobertura ─────────────────────────────────────────────────
  if (hasSinCobertura) {
    const neighborhood = primaryBranch?.neighborhood ?? 'tu colonia';

    // TODO: query `businessBranchNeighborhoodCounts(neighborhood, city_id)` cuando esté
    // disponible en el backend para obtener negocios_en_colonia y repartidores_en_colonia reales.
    const negocios_en_colonia = 0;
    const repartidores_en_colonia = 0;

    return (
      <ZonaEsperaView
        variant="sin_cobertura"
        neighborhood={neighborhood}
        negocios_en_colonia={negocios_en_colonia}
        repartidores_en_colonia={repartidores_en_colonia}
        businessSlug={businessSlug ?? ''}
      />
    );
  }

  // ── Variante zona_espera (pausada) → pantalla de espera sin planes ────────
  if (zona && zona.status === 'pausada') {
    return (
      <ZonaEsperaView
        variant="zona_espera"
        zona={{
          name: zona.name,
          status: zona.status as 'pre_lanzamiento' | 'pausada',
          meta_negocios_apertura: zona.meta_negocios_apertura,
          meta_repartidores_apertura: zona.meta_repartidores_apertura,
          negocios_en_espera: zona.negocios_en_espera,
          repartidores_en_espera: zona.repartidores_en_espera,
        }}
        businessSlug={businessSlug ?? ''}
      />
    );
  }

  // ── Variante pre_lanzamiento → planes visibles pero bloqueados ─────────────
  const prelanzamiento =
    zona && zona.status === 'pre_lanzamiento'
      ? {
          zona: {
            name: zona.name,
            meta_negocios_apertura: zona.meta_negocios_apertura,
            meta_repartidores_apertura: zona.meta_repartidores_apertura,
            negocios_en_espera: zona.negocios_en_espera,
            repartidores_en_espera: zona.repartidores_en_espera,
          },
          businessSlug: businessSlug ?? '',
        }
      : undefined;

  return (
    <main style={{ minHeight: '100vh', background: '#F3EFE7' }}>
      <OnboardingPlanSelector
        plans={plans}
        initialPlanKey={params.plan}
        initialInterval={params.interval as 'WEEK' | 'MONTH' | 'YEAR' | undefined}
        businessName={businessName}
        prelanzamiento={prelanzamiento}
      />
    </main>
  );
}
