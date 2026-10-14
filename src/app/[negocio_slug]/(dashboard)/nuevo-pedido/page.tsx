import { getServerClient, publicClient } from '@/graphql/client';
import { NuevoPedidoForm, TariffTier } from '@/components/orders/NuevoPedidoForm';
import Link from 'next/link';

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
    myOrderUsage {
      used
      limit
      isFree
      gracePeriodEndsAt
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
  let orderUsage: { used: number; limit: number | null; isFree: boolean; gracePeriodEndsAt: string | null } | null = null;
  try {
    const client = await getServerClient();
    const data = await client.request<{
      myBusiness: { branches: { id: string; lat: number | null; lng: number | null; is_primary: boolean }[] };
      myOrderUsage: { used: number; limit: number | null; isFree: boolean; gracePeriodEndsAt: string | null } | null;
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
    orderUsage = data.myOrderUsage ?? null;
  } catch (err) {
    console.error('[nuevo-pedido] branches error:', err);
  }

  const atLimit = orderUsage?.limit != null && orderUsage.used >= orderUsage.limit && !orderUsage.gracePeriodEndsAt;

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
      {atLimit && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontSize: 22 }}>🚫</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#B91C1C', display: 'block' }}>
              Límite semanal alcanzado ({orderUsage!.used}/{orderUsage!.limit} pedidos)
            </span>
            <span style={{ fontSize: 13, color: '#B91C1C', marginTop: 2, display: 'block' }}>
              No puedes crear más pedidos esta semana con el plan Arranque. Actualiza tu plan para continuar.
            </span>
          </div>
          <Link href={`/${negocio_slug}/facturacion`} style={{
            flexShrink: 0,
            background: '#B91C1C',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            padding: '8px 16px',
            borderRadius: 999,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Actualizar plan
          </Link>
        </div>
      )}

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
