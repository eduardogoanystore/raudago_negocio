import { gql } from 'graphql-request';
import { getServerClient } from '@/graphql/client';

const MY_BUSINESS_QUERY = gql`
  query MyBusiness {
    myBusiness {
      id
      name
      billing_status
      billing_day
    }
  }
`;

type Business = {
  id: string;
  name: string;
  billing_status: string;
  billing_day: number;
};

const BILLING_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Activo',     color: '#065F46', bg: '#D1FAE5' },
  overdue:   { label: 'Pendiente',  color: '#92400E', bg: '#FFFBEB' },
  suspended: { label: 'Suspendido', color: 'var(--color-alert)', bg: '#FEF2F2' },
};

function StatusBadge({ status, config }: {
  status: string;
  config: Record<string, { label: string; color: string; bg: string }>;
}) {
  const cfg = config[status] ?? { label: status, color: 'var(--color-muted)', bg: '#F3F4F6' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
    }}>
      {cfg.label}
    </span>
  );
}

function nextBillingDate(billingDay: number): string {
  const today = new Date();
  const candidate = new Date(today.getFullYear(), today.getMonth(), billingDay);
  if (candidate <= today) {
    candidate.setMonth(candidate.getMonth() + 1);
  }
  return candidate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function FacturacionPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  await params;

  let business: Business | null = null;

  try {
    const client = await getServerClient();
    const data = await client.request<{ myBusiness: Business | null }>(MY_BUSINESS_QUERY);
    business = data.myBusiness ?? null;
  } catch {
    // Error de red o auth — mostrar estado de error graceful
  }

  if (!business) {
    return (
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Facturación
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          No se pudo cargar la información de facturación. Intenta recargar la página.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
        Facturación
      </h1>

      {/* Banner overdue */}
      {business.billing_status === 'overdue' && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #F59E0B',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          color: '#92400E',
          fontSize: '0.9rem',
        }}>
          Tienes un pago pendiente. Tu servicio puede ser suspendido pronto. Contacta a soporte.
        </div>
      )}

      {/* Banner suspended */}
      {business.billing_status === 'suspended' && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid var(--color-alert)',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          color: 'var(--color-alert)',
          fontSize: '0.9rem',
        }}>
          Tu servicio está suspendido por falta de pago. Contacta a soporte para reactivarlo.
        </div>
      )}

      {/* Card: estado de suscripción */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Suscripción actual
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Nombre del negocio / plan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Negocio</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{business.name}</span>
          </div>

          {/* Estado de facturación */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Estado</span>
            <StatusBadge status={business.billing_status} config={BILLING_STATUS_CONFIG} />
          </div>

          {/* Día de cobro */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Día de cobro</span>
            <span style={{ fontSize: '0.9rem' }}>Cada día {business.billing_day} del mes</span>
          </div>

          {/* Próximo cobro — solo si el estado lo permite */}
          {business.billing_status !== 'suspended' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Próximo cobro</span>
              <span style={{ fontSize: '0.9rem' }}>{nextBillingDate(business.billing_day)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Historial de cobros */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
          Historial de cobros
        </h2>

        {/* Estado vacío — el backend no expone una query de weekly_billing para el negocio */}
        <HistorialVacio />
      </div>
    </div>
  );
}

// Componente separado para claridad
function HistorialVacio() {
  return (
    <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
      Aún no hay cobros registrados.
    </p>
  );
}

