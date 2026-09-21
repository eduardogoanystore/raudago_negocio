import { getServerClient } from '@/graphql/client';
import NegocioConfigForm from '@/components/business/NegocioConfigForm';

const MY_BUSINESS_FULL_QUERY = `
  query MyBusinessFull {
    myBusiness {
      id
      name
      phone
      email
      address
      lat
      lng
      is_active
      is_verified
      billing_status
      zone {
        id
        name
      }
    }
    me
  }
`;

type BusinessData = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  is_verified: boolean;
  billing_status: string;
  zone: { id: string; name: string } | null;
};

type MeData = {
  first_name: string;
  last_name: string;
  phone: string | null;
};

const BILLING_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Al corriente',  color: '#065F46', bg: '#D1FAE5' },
  overdue:   { label: 'Con adeudo',    color: '#92400E', bg: '#FFFBEB' },
  suspended: { label: 'Suspendido',    color: 'var(--color-alert)', bg: '#FEF2F2' },
};

function StatusBadge({ value, yesLabel, noLabel }: {
  value: boolean;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.65rem',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: value ? '#065F46' : 'var(--color-alert)',
      background: value ? '#D1FAE5' : '#FEF2F2',
    }}>
      {value ? yesLabel : noLabel}
    </span>
  );
}

function BillingStatusBadge({ status }: { status: string }) {
  const cfg = BILLING_STATUS_CONFIG[status] ?? {
    label: status,
    color: 'var(--color-muted)',
    bg: '#F3F4F6',
  };
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

function AccountRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.625rem 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}

export default async function ConfiguracionPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  let business: BusinessData | null = null;
  let account: MeData | null = null;

  try {
    const client = await getServerClient();
    const data = await client.request<{
      myBusiness: BusinessData | null;
      me: MeData | null;
    }>(MY_BUSINESS_FULL_QUERY);
    business = data.myBusiness ?? null;
    account = data.me ?? null;
  } catch {
    // Error de red o auth — mostrar estado graceful
  }

  if (!business) {
    return (
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Mi negocio
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
          No se pudo cargar la información del negocio. Intenta recargar la página.
        </p>
      </div>
    );
  }

  const accountData: MeData = account ?? {
    first_name: '',
    last_name: '',
    phone: null,
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Mi negocio
      </h1>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        Administra la información de tu negocio
      </p>

      {/* Card: información editable */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Información del negocio
        </h2>
        <NegocioConfigForm
          negocio_slug={negocio_slug}
          business={{
            name: business.name,
            phone: business.phone,
            email: business.email,
            address: business.address,
            lat: business.lat,
            lng: business.lng,
            zone: business.zone,
          }}
          account={accountData}
        />
      </div>

      {/* Card: ubicación (readonly) */}
      {(business.lat != null || business.lng != null || business.zone != null) && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            Datos de ubicación
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {business.zone != null && (
              <AccountRow label="Zona asignada">
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {business.zone.name}
                </span>
              </AccountRow>
            )}
            {business.lat != null && (
              <AccountRow label="Latitud">
                <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  {business.lat.toFixed(6)}
                </span>
              </AccountRow>
            )}
            {business.lng != null && (
              <AccountRow label="Longitud">
                <span style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}>
                  {business.lng.toFixed(6)}
                </span>
              </AccountRow>
            )}
          </div>
        </div>
      )}

      {/* Card: estado de la cuenta (readonly) */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Estado de la cuenta
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <AccountRow label="Cuenta activa">
            <StatusBadge value={business.is_active} yesLabel="Activa" noLabel="Inactiva" />
          </AccountRow>
          <AccountRow label="Verificado">
            <StatusBadge value={business.is_verified} yesLabel="Verificado" noLabel="Sin verificar" />
          </AccountRow>
          <AccountRow label="Estado de facturación">
            <BillingStatusBadge status={business.billing_status} />
          </AccountRow>
        </div>
      </div>
    </div>
  );
}
