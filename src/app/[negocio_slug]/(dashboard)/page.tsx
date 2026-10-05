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
      driver_profile {
        driver_account {
          first_name
          last_name
        }
      }
    }
  }
`;

interface DriverProfile {
  driver_account?: {
    first_name: string;
    last_name: string;
  } | null;
}

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
  driver_profile?: DriverProfile | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  created:        { label: 'Creado',              color: '#57544f', bg: '#F3EFE7' },
  pending_driver: { label: 'Buscando repartidor', color: '#92400E', bg: '#FFFBEB' },
  accepted:       { label: 'Aceptado',            color: '#1D4ED8', bg: '#EFF6FF' },
  picked_up:      { label: 'Recolectado',         color: '#C2410C', bg: '#FFF7ED' },
  in_transit:     { label: 'En camino',           color: '#065F46', bg: '#ECFDF5' },
  delivered:      { label: 'Entregado',           color: '#166534', bg: '#DCFCE7' },
  cancelled_by_business: { label: 'Cancelado',   color: '#991B1B', bg: '#FEF2F2' },
  failed_delivery:       { label: 'Fallido',      color: '#7C3AED', bg: '#F5F3FF' },
};

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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
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
  } catch (err) {
    console.error('[Dashboard] myOrders error:', err);
    debugger;
    fetchError = true;
  }

  const todayStr = capitalize(
    new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  // Stats
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const deliveredToday = orders.filter(
    (o) => o.status === 'delivered' && o.delivered_at && isToday(o.delivered_at)
  );
  const deliveredTodayCount = deliveredToday.length;
  const tariffSum = deliveredToday.reduce((acc, o) => acc + (o.tariff_amount ?? 0), 0);

  // "Necesitan algo" — intervention_level !== 'none' OR pending payment
  const needsAttentionOrders = activeOrders.filter(
    (o) => o.intervention_level !== 'none' || o.product_payment_status === 'pending'
  );
  const needsAttentionCount = needsAttentionOrders.length;
  const delayCount = needsAttentionOrders.filter((o) => o.intervention_level !== 'none').length;
  const pendingPayCount = needsAttentionOrders.filter((o) => o.product_payment_status === 'pending').length;

  const attentionSubtext = [
    delayCount > 0 ? `${delayCount} retraso${delayCount > 1 ? 's' : ''}` : '',
    pendingPayCount > 0 ? `${pendingPayCount} pago por confirmar` : '',
  ].filter(Boolean).join(' · ');

  // Table rows — active orders, max 20
  const tableOrders = activeOrders.slice(0, 20);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.02em', color: '#121214' }}>
            {todayStr}
          </span>
          <span style={{ fontSize: 15, color: '#57544f' }}>
            {activeOrders.length} pedidos en curso &middot; {deliveredTodayCount} entregados hoy
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search pill */}
          <div style={{
            height: 44,
            padding: '0 16px',
            borderRadius: 999,
            border: '1px solid #DED7C9',
            background: '#FFFDFA',
            fontSize: 15,
            fontWeight: 600,
            color: '#121214',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
            cursor: 'text',
            userSelect: 'none',
          }}>
            <IconSearch />
            Buscar
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#7d7972' }}>/</span>
          </div>
          {/* Nuevo pedido */}
          <Link
            href={`/${negocio_slug}/nuevo-pedido`}
            style={{
              height: 44,
              padding: '0 22px',
              borderRadius: 999,
              background: '#6C47FF',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            <IconPlus />
            Nuevo pedido
          </Link>
        </div>
      </div>

      {fetchError && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 14,
          color: '#B91C1C',
        }}>
          No se pudieron cargar los datos. Verifica tu conexion e intenta de nuevo.
        </div>
      )}

      {/* Stats cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {/* En curso */}
        <div style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <span style={{ fontSize: 12, color: '#7d7972', fontWeight: 500 }}>En curso</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#121214', lineHeight: 1.1 }}>
            {activeOrders.length}
          </span>
        </div>

        {/* Entregados hoy */}
        <div style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <span style={{ fontSize: 12, color: '#7d7972', fontWeight: 500 }}>Entregados hoy</span>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#121214', lineHeight: 1.1 }}>
            {deliveredTodayCount}
          </span>
        </div>

        {/* Tarifas del dia */}
        <div style={{
          background: '#FFFDFA',
          border: '1px solid #DED7C9',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <span style={{ fontSize: 12, color: '#7d7972', fontWeight: 500 }}>Tarifas del dia</span>
          <span style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#121214',
            fontFamily: 'monospace',
            lineHeight: 1.1,
          }}>
            {formatCurrency(tariffSum)}
          </span>
        </div>

        {/* Necesitan algo */}
        <div style={{
          background: '#FFFDFA',
          border: `1px solid ${needsAttentionCount > 0 ? '#FF5A5F' : '#DED7C9'}`,
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          <span style={{ fontSize: 12, color: '#7d7972', fontWeight: 500 }}>Necesitan algo</span>
          <span style={{
            fontSize: 32,
            fontWeight: 700,
            color: needsAttentionCount > 0 ? '#FF5A5F' : '#121214',
            lineHeight: 1.1,
          }}>
            {needsAttentionCount}
          </span>
          {attentionSubtext && (
            <span style={{ fontSize: 12, color: '#FF5A5F', lineHeight: 1.3 }}>
              {attentionSubtext}
            </span>
          )}
        </div>
      </div>

      {/* Orders table */}
      <div style={{
        background: '#FFFDFA',
        border: '1px solid #DED7C9',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 1.4fr 1fr 170px 130px 100px',
          padding: '10px 18px',
          background: '#F3EFE7',
          borderBottom: '1px solid #DED7C9',
          gap: 12,
        }}>
          {['Pedido', 'Cliente y destino', 'Repartidor', 'Estado', 'Tarifa', ''].map((col) => (
            <span key={col} style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#7d7972',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {col}
            </span>
          ))}
        </div>

        {/* Table body */}
        {tableOrders.length === 0 ? (
          <div style={{ padding: '32px 18px', color: '#7d7972', fontSize: 15 }}>
            No hay pedidos activos en este momento.
          </div>
        ) : (
          tableOrders.map((order, idx) => {
            const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: '#57544f', bg: '#F3EFE7' };
            const driverAcc = order.driver_profile?.driver_account;
            const driverName = driverAcc
              ? `${driverAcc.first_name} ${driverAcc.last_name}`.trim()
              : null;
            const driverInitials = driverAcc
              ? `${driverAcc.first_name[0] ?? ''}${driverAcc.last_name[0] ?? ''}`.toUpperCase()
              : null;

            return (
              <div
                key={order.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1.4fr 1fr 170px 130px 100px',
                  padding: '14px 18px',
                  borderBottom: idx < tableOrders.length - 1 ? '1px solid #F0EBE1' : 'none',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Pedido */}
                <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#57544f', fontWeight: 500 }}>
                  #KZ-{order.order_number}
                </span>

                {/* Cliente y destino */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#121214',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {order.recipient_name}
                  </span>
                  <span style={{
                    fontSize: 13,
                    color: '#57544f',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {order.recipient_address}
                  </span>
                </div>

                {/* Repartidor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {driverName ? (
                    <>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4B2FD6, #8A6CFF)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fff',
                        flexShrink: 0,
                      }}>
                        {driverInitials}
                      </div>
                      <span style={{
                        fontSize: 14,
                        color: '#121214',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {driverName}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 14, color: '#7d7972', fontStyle: 'italic' }}>
                      Buscando...
                    </span>
                  )}
                </div>

                {/* Estado */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 10px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  background: statusInfo.bg,
                  color: statusInfo.color,
                  whiteSpace: 'nowrap',
                  width: 'fit-content',
                }}>
                  {statusInfo.label}
                </span>

                {/* Tarifa */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#121214' }}>
                    {formatCurrency(order.tariff_amount ?? 0)}
                  </span>
                  <span style={{ fontSize: 12, color: '#7d7972' }}>tarifa</span>
                </div>

                {/* Accion */}
                <Link
                  href={`/${negocio_slug}/pedidos/${order.id}`}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#6C47FF',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Ver detalle
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
