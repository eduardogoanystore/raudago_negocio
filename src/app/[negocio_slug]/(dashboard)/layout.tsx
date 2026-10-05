import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { GraphQLClient } from 'graphql-request';
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { LockButton } from '@/components/dashboard/LockButton';
import { LegalReacceptModal } from '@/components/legal/LegalReacceptModal';
import { cacheSubscriptionStatus } from '@/actions/subscription';
import { MY_SUBSCRIPTION_QUERY, ACTIVE_STATUSES } from '@/lib/subscription';
import { getServerClient } from '@/graphql/client';
import Link from 'next/link';

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

const ME_QUERY = `
  query Me {
    me
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

async function getMe(): Promise<{ first_name?: string; last_name?: string; role?: string; is_verified?: boolean } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('businessToken')?.value ?? '';
    const client = new GraphQLClient(ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    });
    const data = await client.request<{ me: Record<string, unknown> }>(ME_QUERY);
    return (data?.me as { first_name?: string; last_name?: string; role?: string; is_verified?: boolean }) ?? null;
  } catch {
    return null;
  }
}

// SVG icons — 17×17, stroke-width 1.75, lucide-style

function IconGrid() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
}

function IconWallet() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/>
      <path d="M20 12h-4a2 2 0 0 0 0 4h4"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12 7 12 12 15 15"/>
      <path d="M9 3.5A9 9 0 0 0 3.5 9"/>
    </svg>
  );
}

function IconReceipt() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="14" y2="14"/>
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
      <circle cx="8" cy="6" r="2"/>
      <circle cx="16" cy="12" r="2"/>
      <circle cx="10" cy="18" r="2"/>
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconHelp() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="M13 6l6 6-6 6"/>
    </svg>
  );
}

const ROLE_LABELS: Record<string, string> = {
  OWNER:   'Propietario',
  MANAGER: 'Gerente',
  STAFF:   'Personal',
};

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
    // Cache miss → consultar subscription_status backend
    const client = await getServerClient();
    const data = await client.request<{
      mySubscription: { status: string } | null;
    }>(MY_SUBSCRIPTION_QUERY);
    const status = data?.mySubscription?.status ?? null;

    if (!status || !ACTIVE_STATUSES.includes(status)) {
      redirect('/registro/plan'); // sin suscripción activa → onboarding de plan
    }

    // Guardar en caché para próximas navegaciones
    // if (businessId && status) {
    //   await cacheSubscriptionStatus(businessId, status);
    // }
  }

  const [pendientes, me] = await Promise.all([
    token ? getLegalPendientes(token) : Promise.resolve([]),
    getMe(),
  ]);

  const userName = me
    ? `${me.first_name ?? ''} ${me.last_name ?? ''}`.trim() || 'Mi cuenta'
    : 'Mi cuenta';
  const userRole = me?.role ? (ROLE_LABELS[me.role] ?? me.role) : '';
  const userInitials = me
    ? `${me.first_name?.[0] ?? ''}${me.last_name?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';
  if (me && me.is_verified === false) {
    redirect('/verificar-email-negocio');
  }

  const navItems = [
    {
      label: 'Panel',
      href: `/${negocio_slug}/`,
      icon: <IconGrid />,
    },
    {
      label: 'Seguimiento',
      href: `/${negocio_slug}/pedidos`,
      icon: <IconMap />,
    },
    {
      label: 'Efectivo',
      href: `/${negocio_slug}/efectivo`,
      icon: <IconWallet />,
    },
    {
      label: 'Historial',
      href: `/${negocio_slug}/historial`,
      icon: <IconClock />,
    },
    {
      label: 'Facturacion',
      href: `/${negocio_slug}/facturacion`,
      icon: <IconReceipt />,
    },
    {
      label: 'Cobro y envio',
      href: `/${negocio_slug}/cobro`,
      icon: <IconSliders />,
    },
    {
      label: 'Empleados',
      href: `/${negocio_slug}/empleados`,
      icon: <IconUsers />,
    },
    {
      label: 'Soporte',
      href: `/${negocio_slug}/soporte`,
      icon: <IconHelp />,
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 230,
        background: '#121214',
        padding: '20px 14px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}>
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 4 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#6C47FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconArrow />
          </div>
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 17,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}>
            RaudaGo
          </span>
        </div>

        {/* Nuevo pedido pill */}
        <Link
          href={`/${negocio_slug}/nuevo-pedido`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 46,
            borderRadius: 999,
            background: '#6C47FF',
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <IconPlus />
          Nuevo pedido
          <span style={{
            fontFamily: 'monospace',
            fontSize: 12,
            fontWeight: 400,
            opacity: 0.65,
            marginLeft: 2,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 4,
            padding: '1px 5px',
          }}>
            N
          </span>
        </Link>

        {/* Nav */}
        <SidebarNav items={navItems} />

        {/* Footer */}
        <div style={{
          marginTop: 'auto',
          borderTop: '1px solid #26262C',
          paddingTop: 12,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
          {/* Avatar */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4B2FD6, #8A6CFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 12,
            fontWeight: 700,
            color: '#fff',
          }}>
            {userInitials}
          </div>

          {/* Name + role */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {userName}
            </span>
            {userRole && (
              <span style={{ fontSize: 11, color: '#8E8B93', whiteSpace: 'nowrap' }}>
                {userRole}
              </span>
            )}
          </div>

          {/* Lock + Logout inline */}
          <LockButton />
          <LogoutButton compact />
        </div>
      </aside>

      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        background: '#F7F4EF',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {children}
      </main>

      {pendientes.length > 0 && <LegalReacceptModal docs={pendientes} />}
    </div>
  );
}
