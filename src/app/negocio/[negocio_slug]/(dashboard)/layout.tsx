import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  const navItems = [
    { label: 'Inicio',          href: `/negocio/${negocio_slug}/` },
    { label: 'Nuevo pedido',    href: `/negocio/${negocio_slug}/nuevo-pedido` },
    { label: 'Pedidos activos', href: `/negocio/${negocio_slug}/pedidos` },
    { label: 'Historial',       href: `/negocio/${negocio_slug}/historial` },
    { label: 'Empleados',       href: `/negocio/${negocio_slug}/empleados` },
    { label: 'Mi negocio',      href: `/negocio/${negocio_slug}/configuracion` },
    { label: 'Facturacion',     href: `/negocio/${negocio_slug}/facturacion` },
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
    </div>
  );
}
