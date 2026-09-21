import { gql } from 'graphql-request';
import { getServerClient } from '@/graphql/client';

const HISTORY_ORDERS_QUERY = gql`
  query MyHistoryOrders {
    myOrders(filters: { limit: 100 }) {
      id
      order_number
      status
      recipient_name
      recipient_address
      tariff_amount
      product_payment_method
      cancellation_reason
      created
    }
  }
`;

interface HistoryOrder {
  id: string;
  order_number: string;
  status: string;
  recipient_name: string;
  recipient_address: string;
  tariff_amount: number;
  product_payment_method: string;
  cancellation_reason: string | null;
  created: string;
}

const HISTORY_STATUSES = new Set(['delivered', 'cancelled', 'failed_delivery']);

const STATUS_CONFIG: Record<string, { label: string; background: string; color: string }> = {
  delivered:       { label: 'Entregado', background: '#D1FAE5', color: '#10B981' },
  cancelled:       { label: 'Cancelado', background: '#FEE2E2', color: 'var(--color-alert)' },
  failed_delivery: { label: 'Fallido',   background: '#F3F4F6', color: 'var(--color-muted)' },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash:     'Efectivo',
  transfer: 'Transferencia',
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

export default async function HistorialPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  // negocio_slug disponible para uso futuro (filtros, links)
  await params;

  let allOrders: HistoryOrder[] = [];
  let fetchError = false;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myOrders: HistoryOrder[] }>(HISTORY_ORDERS_QUERY);
    allOrders = data.myOrders ?? [];
  } catch {
    fetchError = true;
  }

  const orders = allOrders
    .filter((o) => HISTORY_STATUSES.has(o.status))
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Historial de pedidos
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
          {fetchError
            ? 'Error al cargar'
            : `${orders.length} pedido${orders.length !== 1 ? 's' : ''} completado${orders.length !== 1 ? 's' : ''}`}
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
          No se pudo cargar el historial. Verifica tu conexion e intenta de nuevo.
        </div>
      )}

      {!fetchError && orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
          <p>Aun no hay pedidos completados.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              background: '#F3F4F6',
              color: 'var(--color-muted)',
            };
            const paymentLabel =
              PAYMENT_METHOD_LABELS[order.product_payment_method] ?? order.product_payment_method;

            return (
              <div
                key={order.id}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                {/* Lado izquierdo */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                    #{order.order_number}
                  </p>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.15rem' }}>
                    {order.recipient_name}
                  </p>
                  <p style={{
                    color: 'var(--color-muted)',
                    fontSize: '0.8rem',
                    marginBottom: '0.4rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {order.recipient_address}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    {paymentLabel}
                  </p>
                  {order.cancellation_reason && (
                    <p style={{
                      marginTop: '0.4rem',
                      fontSize: '0.78rem',
                      color: 'var(--color-muted)',
                      fontStyle: 'italic',
                    }}>
                      Razon: {order.cancellation_reason}
                    </p>
                  )}
                </div>

                {/* Lado derecho */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: statusCfg.background,
                    color: statusCfg.color,
                    marginBottom: '0.5rem',
                  }}>
                    {statusCfg.label}
                  </span>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                    {formatCurrency(order.tariff_amount)}
                  </p>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>
                    {formatDateTime(order.created)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
