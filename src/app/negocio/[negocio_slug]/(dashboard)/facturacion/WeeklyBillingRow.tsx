const WEEKLY_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'var(--color-muted)', bg: '#F3F4F6' },
  paid:    { label: 'Pagado',    color: '#065F46',             bg: '#D1FAE5' },
  overdue: { label: 'Vencido',   color: 'var(--color-alert)',  bg: '#FEF2F2' },
  waived:  { label: 'Condonado', color: '#1E40AF',             bg: '#DBEAFE' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = WEEKLY_STATUS_CONFIG[status] ?? { label: status, color: 'var(--color-muted)', bg: '#F3F4F6' };
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

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function WeeklyBillingRow({
  billing,
}: {
  billing: {
    id: string;
    period_start: string;
    period_end: string;
    amount: number;
    status: string;
    paid_at?: string | null;
  };
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <div>
        <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          {formatDate(billing.period_start)} — {formatDate(billing.period_end)}
        </p>
        {billing.paid_at && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
            Pagado el {formatDate(billing.paid_at)}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1rem', fontWeight: 600 }}>
          ${billing.amount.toFixed(2)} MXN
        </span>
        <StatusBadge status={billing.status} />
      </div>
    </div>
  );
}
