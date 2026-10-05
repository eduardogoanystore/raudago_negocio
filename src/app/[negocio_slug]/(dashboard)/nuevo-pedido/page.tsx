import { getServerClient, publicClient } from '@/graphql/client';
import { NuevoPedidoForm, TariffTier } from '@/components/orders/NuevoPedidoForm';

const TARIFF_TIERS_QUERY = `
  query tariffTiers {
    tariffTiers {
      id
      min_km
      max_km
      price
      extra_per_km
    }
  }
`;

const MY_BUSINESS_COORDS_QUERY = `
  query myBusiness {
    myBusiness {
      branches {
        id
        lat
        lng
        is_primary
      }
    }
  }
`;

export default async function NuevoPedidoPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  let tiers: TariffTier[] = [];
  try {
    const data = await publicClient.request<{ tariffTiers: TariffTier[] }>(TARIFF_TIERS_QUERY);
    tiers = data.tariffTiers ?? [];
  } catch {
    // Si falla, el formulario muestra "—" en la vista previa de tarifa
  }

  let originLat: number | null = null;
  let originLng: number | null = null;
  let branchId: string | null = null;
  try {
    const client = await getServerClient();
    const data = await client.request<{
      myBusiness: { branches: { id: string; lat: number | null; lng: number | null; is_primary: boolean }[] };
    }>(MY_BUSINESS_COORDS_QUERY);
    const branches = data.myBusiness?.branches ?? [];
    const primary = branches.find((b) => b.is_primary) ?? branches[0] ?? null;
    if (primary) {
      branchId = primary.id ?? null;
      if (primary.lat != null && primary.lng != null) {
        originLat = Number(primary.lat);
        originLng = Number(primary.lng);
      }
    }
  } catch (err) {
    console.error('[nuevo-pedido] branches error:', err);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#121214', margin: 0 }}>
            Nuevo pedido
          </h1>
          <p style={{ fontSize: 14, color: '#57544f', margin: '4px 0 0' }}>
            Completa los datos del envío
          </p>
        </div>
      </div>
      <NuevoPedidoForm
        negocio_slug={negocio_slug}
        tiers={tiers}
        originLat={originLat}
        originLng={originLng}
        branchId={branchId}
      />
    </div>
  );
}
