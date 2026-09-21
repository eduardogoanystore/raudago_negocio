import { gql } from 'graphql-request';
import { getServerClient } from '@/graphql/client';
import Link from 'next/link';

const ACTIVE_STATUSES = new Set(['created', 'pending_driver', 'accepted', 'picked_up', 'in_transit']);

const MY_ORDERS_QUERY = gql`
  query MyOrdersDashboard($filters: OrderFilters) {
    myOrders(filters: $filters) {
      id
      order_number
      status
      intervention_level
      product_payment_status
      recipient_name
      recipient_address
      tariff_amount
      created
      delivered_at
    }
  }
`;

interface DeliveryOrder {
  id: string;
  order_number: string;
  status: string;
  intervention_level: string;
  product_payment_status: string;
  recipient_name: string;
  recipient_address: string;
  tariff_amount: number;
  created: string;
  delivered_at: string | null;
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default async function NegocioDashboard({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  let orders: DeliveryOrder[] = [];
  let fetchError = false;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myOrders: DeliveryOrder[] }>(MY_ORDERS_QUERY, {
      filters: { limit: 100 },
    });
    orders = data.myOrders ?? [];
  } catch {
    fetchError = true;
  }

  const todayStr = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Calcular stats
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const inTransitCount = orders.filter((o) => o.status === 'in_transit').length;
  const deliveredTodayCount = orders.filter(
    (o) => o.status === 'delivered' && o.delivered_at && isToday(o.delivered_at)
  ).length;
  const pendingPaymentCount = orders.filter(
    (o) => ACTIVE_STATUSES.has(o.status) && o.product_payment_status === 'pending'
  ).length;

  const stats = [
    { label: 'Pedidos activos',     value: activeOrders.length, color: 'var(--color-primary)' },
    { label: 'En camino',           value: inTransitCount,      color: '#10B981' },
    { label: 'Entregados hoy',      value: deliveredTodayCount, color: 'var(--color-foreground)' },
    { label: 'Pendientes de pago',  value: pendingPaymentCount, color: 'var(--color-alert)' },
  ];

  // Pedidos activos recientes para la lista (max 5)
  const recentActive = activeOrders.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Bienvenido
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
          {todayStr}
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
          No se pudieron cargar los datos. Verifica tu conexion e intenta de nuevo.
        </div>
      )}

      {/* Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: 'var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            borderLeft: `4px solid ${stat.color}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Lista de pedidos activos recientes */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Pedidos activos recientes</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              href={`/negocio/${negocio_slug}/pedidos`}
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-primary)',
                fontWeight: 500,
              }}
            >
              Ver todos
            </Link>
            <Link
              href={`/negocio/${negocio_slug}/nuevo-pedido`}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              + Nuevo pedido
            </Link>
          </div>
        </div>

        {recentActive.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            No hay pedidos activos en este momento.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActive.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'var(--color-muted)' };
              return (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'var(--color-background)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ fontWeight: 600, minWidth: '4rem', color: 'var(--color-foreground)' }}>
                    #{order.order_number}
                  </span>
                  <span style={{ flex: 1, color: 'var(--color-foreground)' }}>
                    {order.recipient_name}
                  </span>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: statusInfo.color + '20',
                    color: statusInfo.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {statusInfo.label}
                  </span>
                  <span style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                    {formatTime(order.created)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
