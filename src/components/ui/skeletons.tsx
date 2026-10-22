import { Skeleton } from './Skeleton';

// ---------------------------------------------------------------------------
// Dashboard (/)
// Mirrors: header row, 4 stat cards, table with 5 rows
// ---------------------------------------------------------------------------
export function DashboardSkeleton() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton style={{ width: 280, height: 28 }} />
          <Skeleton style={{ width: 200, height: 16 }} />
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <Skeleton style={{ width: 120, height: 44, borderRadius: 999 }} />
          <Skeleton style={{ width: 148, height: 44, borderRadius: 999 }} />
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 14,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <Skeleton style={{ width: 72, height: 12 }} />
            <Skeleton style={{ width: 52, height: 36 }} />
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 1.4fr 1fr 170px 130px 100px',
          padding: '10px 18px',
          background: 'var(--color-background)',
          borderBottom: '1px solid var(--color-border)',
          gap: 12,
        }}>
          {[80, 120, 100, 90, 60, 40].map((w, i) => (
            <Skeleton key={i} style={{ width: w, height: 12 }} />
          ))}
        </div>

        {/* Table rows */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: '110px 1.4fr 1fr 170px 130px 100px',
            padding: '14px 18px',
            borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none',
            alignItems: 'center',
            gap: 12,
          }}>
            {/* Order number */}
            <Skeleton style={{ width: 72, height: 14 }} />
            {/* Client + address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Skeleton style={{ width: '80%', height: 14 }} />
              <Skeleton style={{ width: '60%', height: 12 }} />
            </div>
            {/* Driver */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Skeleton style={{ width: 28, height: 28, borderRadius: '50%' }} />
              <Skeleton style={{ width: 90, height: 13 }} />
            </div>
            {/* Status badge */}
            <Skeleton style={{ width: 110, height: 24, borderRadius: 999 }} />
            {/* Tariff */}
            <Skeleton style={{ width: 72, height: 16 }} />
            {/* Action */}
            <Skeleton style={{ width: 68, height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pedidos activos (/pedidos)
// Mirrors: h1 + subtitle, 5 order cards with left border, header row, recipient row
// ---------------------------------------------------------------------------
export function PedidosSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <Skeleton style={{ width: 200, height: 28, marginBottom: 8 }} />
        <Skeleton style={{ width: 140, height: 14 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            background: 'var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            borderLeft: '4px solid var(--color-border)',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton style={{ width: 64, height: 16 }} />
                <Skeleton style={{ width: 90, height: 22, borderRadius: 999 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <Skeleton style={{ width: 72, height: 15 }} />
                <Skeleton style={{ width: 90, height: 12 }} />
              </div>
            </div>
            {/* Recipient */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Skeleton style={{ width: '55%', height: 14 }} />
              <Skeleton style={{ width: '75%', height: 13 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Historial (/historial)
// Mirrors: h1 + subtitle, list of history order cards (two-column layout)
// ---------------------------------------------------------------------------
export function HistorialSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <Skeleton style={{ width: 240, height: 28, marginBottom: 8 }} />
        <Skeleton style={{ width: 160, height: 14 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            background: 'var(--color-surface)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            {/* Left side */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton style={{ width: 64, height: 15 }} />
              <Skeleton style={{ width: '50%', height: 14 }} />
              <Skeleton style={{ width: '70%', height: 12 }} />
              <Skeleton style={{ width: 72, height: 12 }} />
            </div>
            {/* Right side */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <Skeleton style={{ width: 76, height: 22, borderRadius: 999 }} />
              <Skeleton style={{ width: 64, height: 15 }} />
              <Skeleton style={{ width: 100, height: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empleados (/empleados)
// Mirrors: header row with title + invite button, member list card
// ---------------------------------------------------------------------------
export function EmpleadosSkeleton() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <Skeleton style={{ width: 140, height: 28 }} />
          <Skeleton style={{ width: 80, height: 14 }} />
        </div>
        <Skeleton style={{ width: 140, height: 40, borderRadius: 8 }} />
      </div>

      {/* Member list */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        overflow: 'hidden',
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.25rem',
            borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
          }}>
            <Skeleton style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton style={{ width: '40%', height: 14 }} />
              <Skeleton style={{ width: '60%', height: 12 }} />
            </div>
            <Skeleton style={{ width: 72, height: 22, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empleado detalle (/empleados/[member_id])
// Mirrors: back link, employee card (avatar + name + badges + actions), optional PIN card
// ---------------------------------------------------------------------------
export function EmpleadoDetalleSkeleton() {
  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Back link */}
      <Skeleton style={{ width: 96, height: 14, marginBottom: '1.5rem' }} />

      {/* Employee card */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <Skeleton style={{ width: 180, height: 18, marginBottom: '1.25rem' }} />

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <Skeleton style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Skeleton style={{ width: 160, height: 16 }} />
            <Skeleton style={{ width: 200, height: 14 }} />
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Skeleton style={{ width: 76, height: 26, borderRadius: 999 }} />
          <Skeleton style={{ width: 66, height: 26, borderRadius: 999 }} />
        </div>
      </div>

      {/* PIN card */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
      }}>
        <Skeleton style={{ width: 180, height: 18, marginBottom: 10 }} />
        <Skeleton style={{ width: '80%', height: 14, marginBottom: 6 }} />
        <Skeleton style={{ width: '60%', height: 14, marginBottom: '1rem' }} />
        <Skeleton style={{ width: 200, height: 40, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Configuracion (/configuracion)
// Mirrors: h1, 4 section cards (info form, images, URL, account status)
// ---------------------------------------------------------------------------
export function ConfiguracionSkeleton() {
  return (
    <div>
      <Skeleton style={{ width: 160, height: 28, marginBottom: 8 }} />
      <Skeleton style={{ width: 280, height: 14, marginBottom: '2rem' }} />

      {/* Card: info form */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <Skeleton style={{ width: 200, height: 18, marginBottom: '1.25rem' }} />
        {[160, 240, 180, 140].map((w, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <Skeleton style={{ width: w * 0.6, height: 12, marginBottom: 6 }} />
            <Skeleton style={{ width: '100%', height: 40, borderRadius: 8 }} />
          </div>
        ))}
        <Skeleton style={{ width: 120, height: 40, borderRadius: 8, marginTop: 8 }} />
      </div>

      {/* Card: images */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <Skeleton style={{ width: 200, height: 18, marginBottom: 8 }} />
        <Skeleton style={{ width: '70%', height: 13, marginBottom: '1.5rem' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton style={{ width: 80, height: 14 }} />
              <Skeleton style={{ width: '100%', height: 140, borderRadius: 12 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Card: URL */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <Skeleton style={{ width: 140, height: 18, marginBottom: 8 }} />
        <Skeleton style={{ width: '65%', height: 13, marginBottom: '1.25rem' }} />
        <Skeleton style={{ width: '100%', height: 40, borderRadius: 8 }} />
      </div>

      {/* Card: account status */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
      }}>
        <Skeleton style={{ width: 200, height: 18, marginBottom: '1.25rem' }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.625rem 0',
            borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
          }}>
            <Skeleton style={{ width: 120, height: 14 }} />
            <Skeleton style={{ width: 76, height: 22, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Facturacion (/facturacion)
// Mirrors: h1, subscription card (4 rows), billing history card
// ---------------------------------------------------------------------------
export function FacturacionSkeleton() {
  return (
    <div>
      <Skeleton style={{ width: 160, height: 28, marginBottom: '1.5rem' }} />

      {/* Card: subscription */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <Skeleton style={{ width: 180, height: 18, marginBottom: '1rem' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton style={{ width: 100, height: 14 }} />
              <Skeleton style={{ width: 80, height: 20, borderRadius: 999 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Card: billing history */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
      }}>
        <Skeleton style={{ width: 200, height: 18, marginBottom: '1rem' }} />
        <Skeleton style={{ width: 220, height: 14 }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nuevo pedido (/nuevo-pedido)
// Mirrors: h1 + subtitle, large form card with several input rows
// ---------------------------------------------------------------------------
export function NuevoPedidoSkeleton() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Skeleton style={{ width: 200, height: 28, marginBottom: 8 }} />
        <Skeleton style={{ width: 220, height: 14 }} />
      </div>

      {/* Form area */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 16,
        padding: '1.75rem',
      }}>
        {/* Section: recipient */}
        <Skeleton style={{ width: 140, height: 16, marginBottom: '1.25rem' }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <Skeleton style={{ width: 110, height: 12, marginBottom: 6 }} />
            <Skeleton style={{ width: '100%', height: 42, borderRadius: 8 }} />
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

        {/* Section: address */}
        <Skeleton style={{ width: 120, height: 16, marginBottom: '1.25rem' }} />
        <div style={{ marginBottom: '1rem' }}>
          <Skeleton style={{ width: 100, height: 12, marginBottom: 6 }} />
          <Skeleton style={{ width: '100%', height: 42, borderRadius: 8 }} />
        </div>
        <Skeleton style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: '1rem' }} />

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

        {/* Section: payment */}
        <Skeleton style={{ width: 160, height: 16, marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', gap: 12, marginBottom: '1rem' }}>
          <Skeleton style={{ width: '50%', height: 48, borderRadius: 10 }} />
          <Skeleton style={{ width: '50%', height: 48, borderRadius: 10 }} />
        </div>

        {/* Tariff preview */}
        <div style={{
          background: 'var(--color-background)',
          borderRadius: 10,
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Skeleton style={{ width: 100, height: 14 }} />
          <Skeleton style={{ width: 80, height: 22 }} />
        </div>

        {/* Submit */}
        <Skeleton style={{ width: '100%', height: 48, borderRadius: 999 }} />
      </div>
    </div>
  );
}
