import { publicClient } from '@/graphql/client';
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

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Nuevo pedido
      </h1>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Completa los datos del envio
      </p>
      <div style={{ maxWidth: '640px' }}>
        <NuevoPedidoForm negocio_slug={negocio_slug} tiers={tiers} />
      </div>
    </div>
  );
}
