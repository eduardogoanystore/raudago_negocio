'use client';

import Link from 'next/link';

interface BusinessAccount {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface Member {
  id: string;
  role: string;
  status: string;
  invitation_email: string | null;
  is_owner: boolean;
  business_account: BusinessAccount | null;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  owner:   { label: 'Dueno',     color: '#6C47FF', bg: '#EDE9FE' },
  manager: { label: 'Encargado', color: '#0284C7', bg: '#E0F2FE' },
  staff:   { label: 'Cajero',    color: '#059669', bg: '#D1FAE5' },
  counter: { label: 'Contador',  color: '#6B7280', bg: '#F3F4F6' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Activo',     color: '#065F46', bg: '#D1FAE5' },
  invited:   { label: 'Invitado',   color: '#92400E', bg: '#FEF3C7' },
  suspended: { label: 'Suspendido', color: '#9A3412', bg: '#FEF2F2' },
  inactive:  { label: 'Inactivo',   color: '#6B7280', bg: '#F3F4F6' },
};

export function EmployeeRow({
  member,
  negocio_slug,
}: {
  member: Member;
  negocio_slug: string;
}) {
  const role = ROLE_CONFIG[member.role] ?? { label: member.role, color: '#6B7280', bg: '#F3F4F6' };
  const status = STATUS_CONFIG[member.status] ?? { label: member.status, color: '#6B7280', bg: '#F3F4F6' };

  const account = member.business_account;
  const displayName =
    account?.first_name && account?.last_name
      ? `${account.first_name} ${account.last_name}`
      : null;
  const email = account?.email ?? member.invitation_email ?? '';
  const initial = displayName ? displayName[0].toUpperCase() : email[0]?.toUpperCase() ?? '?';

  return (
    <Link
      href={`/negocio/${negocio_slug}/empleados/${member.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: role.bg,
        color: role.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '1rem',
        flexShrink: 0,
      }}>
        {initial}
      </div>

      {/* Name + email */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {displayName && (
          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
            {displayName}
          </p>
        )}
        <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {email}
        </p>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: role.bg,
          color: role.color,
        }}>
          {role.label}
        </span>
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          background: status.bg,
          color: status.color,
        }}>
          {status.label}
        </span>
      </div>
    </Link>
  );
}
