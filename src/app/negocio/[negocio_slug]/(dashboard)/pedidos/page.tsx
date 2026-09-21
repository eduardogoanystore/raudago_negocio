import { gql } from 'graphql-request';
import { getServerClient } from '@/graphql/client';
import { ConfirmTransferButton } from '@/components/orders/ConfirmTransferButton';

const ACTIVE_STATUSES = ['created', 'pending_driver', 'accepted', 'picked_up', 'in_transit'];

const ACTIVE_ORDERS_QUERY = gql`
  query MyActiveOrders {
    myOrders(filters: { limit: 100 }) {
      id
      order_number
      status
      intervention_level
      intervention_reason
      product_payment_method
      product_payment_status
      recipient_name
      recipient_phone
      recipient_address
      tariff_amount
      distance_km
      created
    }
  }
`;

interface DeliveryOrder {
  id: string;
  order_number: string;
  status: string;
  intervention_level: string;
  intervention_reason: string | null;
  product_payment_method: string;
  product_payment_status: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  tariff_amount: number;
  distance_km: number;
  created: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  created:        { label: 'Creado',               color: 'var(--color-muted)' },
  pending_driver: { label: 'Buscando repartidor',  color: '#F59E0B' },
  accepted:       { label: 'Aceptado',             color: '#3B82F6' },
  picked_up:      { label: 'Recolectado',          color: '#F97316' },
  in_transit:     { label: 'En camino',            color: '#10B981' },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default async function PedidosActivosPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  let allOrders: DeliveryOrder[] = [];
  let fetchError = false;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myOrders: DeliveryOrder[] }>(ACTIVE_ORDERS_QUERY);
    allOrders = data.myOrders ?? [];
  } catch {
    fetchError = true;
  }

  // Filtrar solo los activos y ordenar por created desc (el backend ya ordena desc, pero filtramos aqui)
  const orders = allOrders
    .filter((o) => ACTIVE_STATUSES.includes(o.status))
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Pedidos activos
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
          {fetchError ? 'Error al cargar' : `${orders.length} pedido${orders.length !== 1 ? 's' : ''} en curso`}
        </p>
      </div>

      {fetchError && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: '#B91C1C',
        }}>
          No se pudieron cargar los pedidos. Verifica tu conexion e intenta de nuevo.
        </div>
      )}

      {!fetchError && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Sin pedidos activos</p>
          <a
            href={`/negocio/${negocio_slug}/nuevo-pedido`}
            style={{
              display: 'inline-block',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '0.6rem 1.25rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: '0.75rem',
            }}
          >
            Crear primer pedido
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map((order) => {
            const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'var(--color-muted)' };
            const isAtRisk = order.intervention_level === 'at_risk';
            const needsIntervention = order.intervention_level === 'requires_intervention';
            const needsPaymentConfirm =
              order.product_payment_method === 'transfer' &&
              order.product_payment_status === 'pending';

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: needsIntervention
                    ? '4px solid var(--color-alert)'
                    : isAtRisk
                    ? '4px solid #F59E0B'
                    : '4px solid var(--color-border)',
                }}
              >
                {/* Header row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      #{order.order_number}
                    </span>

                    {/* Status badge */}
                    <span style={{
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: statusInfo.color + '20',
                      color: statusInfo.color,
                    }}>
                      {statusInfo.label}
                    </span>

                    {/* Intervention badges */}
                    {needsIntervention && (
                      <span style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#FEE2E2',
                        color: 'var(--color-alert)',
                      }}>
                        Requiere intervencion
                      </span>
                    )}
                    {isAtRisk && !needsIntervention && (
                      <span style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#FEF3C7',
                        color: '#D97706',
                      }}>
                        En riesgo
                      </span>
                    )}
                  </div>

                  {/* Tariff + time */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatCurrency(order.tariff_amount)}
                    </p>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                      {formatDate(order.created)} {formatTime(order.created)}
                    </p>
                  </div>
                </div>

                {/* Recipient info */}
                <div style={{ fontSize: '0.875rem', marginBottom: needsPaymentConfirm ? '0.75rem' : 0 }}>
                  <p style={{ fontWeight: 500, marginBottom: '0.15rem' }}>{order.recipient_name}</p>
                  <p style={{ color: 'var(--color-muted)' }}>{order.recipient_address}</p>
                </div>

                {/* Payment confirmation */}
                {needsPaymentConfirm && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.8rem', color: '#92400E', marginBottom: '0.5rem' }}>
                      Pago por transferencia pendiente de confirmacion
                    </p>
                    <ConfirmTransferButton orderId={order.id} negocio_slug={negocio_slug} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
