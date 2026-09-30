import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { LegalReacceptModal } from '@/components/legal/LegalReacceptModal';
import { cacheSubscriptionStatus } from '@/actions/subscription';
import { MY_SUBSCRIPTION_QUERY, ACTIVE_STATUSES } from '@/lib/subscription';
import { getServerClient } from '@/graphql/client';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

const LEGAL_PENDIENTES = `
  query legalDocumentsPendientes {
    legalDocumentsPendientes {
      id
      tipo
      version
      contenido
    }
  }
`;

async function getLegalPendientes(token: string) {
  try {
    const client = new GraphQLClient(ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    });
    const data = await client.request<{
      legalDocumentsPendientes: { id: string; tipo: string; version: string; contenido: string }[];
    }>(LEGAL_PENDIENTES);
    return data.legalDocumentsPendientes;
  } catch {
    return [];
  }
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value ?? '';

  // Fast-path: cookie caché (evita GraphQL en cada navegación)
  const businessId = cookieStore.get('business_id')?.value;
  const cachedStatus = businessId ? cookieStore.get(`sub_status_${businessId}`)?.value : null;
  const isCachedActive = cachedStatus != null && ACTIVE_STATUSES.includes(cachedStatus);

  if (!isCachedActive) {
    // Cache miss → consultar backend
    const client = await getServerClient();
    const data = await client.request<{
      mySubscription: { status: string } | null;
    }>(MY_SUBSCRIPTION_QUERY);
    const status = data?.mySubscription?.status ?? null;

    if (!status || !ACTIVE_STATUSES.includes(status)) {
      redirect('/registro/plan'); // sin suscripción activa → onboarding de plan
    }

    // Guardar en caché para próximas navegaciones
    if (businessId && status) {
      await cacheSubscriptionStatus(businessId, status);
    }
  }

  const pendientes = token ? await getLegalPendientes(token) : [];

  const navItems = [
    { label: 'Inicio',          href: `/${negocio_slug}/` },
    { label: 'Nuevo pedido',    href: `/${negocio_slug}/nuevo-pedido` },
    { label: 'Pedidos activos', href: `/${negocio_slug}/pedidos` },
    { label: 'Historial',       href: `/${negocio_slug}/historial` },
    { label: 'Empleados',       href: `/${negocio_slug}/empleados` },
    { label: 'Mi negocio',      href: `/${negocio_slug}/configuracion` },
    { label: 'Facturacion',     href: `/${negocio_slug}/facturacion` },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: '220px',
        background: 'var(--color-foreground)',
        color: 'white',
        padding: '1.5rem 1rem',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          marginBottom: '2rem',
          paddingLeft: '0.5rem',
        }}>
          Rauda<span style={{ color: 'white' }}>Go</span>
        </div>
        <SidebarNav items={navItems} />
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <LogoutButton />
        </div>
      </aside>
      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        background: 'var(--color-background)',
      }}>
        {children}
      </main>

      {pendientes.length > 0 && <LegalReacceptModal docs={pendientes} />}
    </div>
  );
}
