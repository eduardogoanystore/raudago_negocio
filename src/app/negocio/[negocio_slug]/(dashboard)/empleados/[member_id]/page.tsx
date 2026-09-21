import { notFound } from 'next/navigation';
import { getServerClient } from '@/graphql/client';
import { validateSession } from '@/utils/auth/validateSession';
import { SetPinForm } from '@/components/employees/SetPinForm';
import { DeactivateMemberButton } from '@/components/employees/DeactivateMemberButton';

const BUSINESS_MEMBERS_QUERY = `
  query businessMembers {
    businessMembers {
      id
      role
      status
      invitation_email
      is_owner
      business_account {
        id
        first_name
        last_name
        email
      }
    }
  }
`;

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

export default async function EmpleadoDetallePage({
  params,
}: {
  params: Promise<{ negocio_slug: string; member_id: string }>;
}) {
  const { negocio_slug, member_id } = await params;

  const [session, membersData] = await Promise.all([
    validateSession(),
    getServerClient().then((client) =>
      client.request<{ businessMembers: Member[] }>(BUSINESS_MEMBERS_QUERY)
    ).catch(() => null),
  ]);

  if (!membersData) {
    return (
      <div style={{
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        color: '#B91C1C',
      }}>
        No se pudo cargar la informacion del empleado.
      </div>
    );
  }

  const member = membersData.businessMembers.find((m) => m.id === member_id);
  if (!member) notFound();

  // Current session role
  const sessionMember = session
    ? membersData.businessMembers.find((m) => m.business_account?.id === session.sub)
    : null;
  const sessionRole = sessionMember?.role ?? '';
  const canManage = sessionRole === 'owner' || sessionRole === 'manager';
  const isOwnProfile = session?.sub === member.business_account?.id;

  const role = ROLE_CONFIG[member.role] ?? { label: member.role, color: '#6B7280', bg: '#F3F4F6' };
  const status = STATUS_CONFIG[member.status] ?? { label: member.status, color: '#6B7280', bg: '#F3F4F6' };

  const account = member.business_account;
  const displayName =
    account?.first_name && account?.last_name
      ? `${account.first_name} ${account.last_name}`
      : null;
  const email = account?.email ?? member.invitation_email ?? '';
  const initial = displayName ? displayName[0].toUpperCase() : email[0]?.toUpperCase() ?? '?';

  const canDeactivate = canManage && !member.is_owner && member.status === 'active';
  const canRemove = canManage && !member.is_owner && (member.status === 'invited' || member.status === 'inactive');

  return (
    <div style={{ maxWidth: '640px' }}>
      {/* Back link */}
      <a
        href={`/negocio/${negocio_slug}/empleados`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}
      >
        ← Empleados
      </a>

      {/* Card: datos del empleado */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Datos del empleado</h2>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: role.bg,
            color: role.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1.4rem',
            flexShrink: 0,
          }}>
            {initial}
          </div>
          <div>
            {displayName && (
              <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{displayName}</p>
            )}
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>{email}</p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: role.bg,
            color: role.color,
          }}>
            {role.label}
          </span>
          <span style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: status.bg,
            color: status.color,
          }}>
            {status.label}
          </span>
        </div>

        {/* Action buttons */}
        {(canDeactivate || canRemove) && (
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {canDeactivate && (
              <DeactivateMemberButton
                memberId={member.id}
                negocio_slug={negocio_slug}
                action="deactivate"
              />
            )}
            {canRemove && (
              <DeactivateMemberButton
                memberId={member.id}
                negocio_slug={negocio_slug}
                action="remove"
              />
            )}
          </div>
        )}
      </div>

      {/* Card: PIN (solo si es el perfil propio) */}
      {isOwnProfile && (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>PIN de mostrador</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Configura un PIN de 4 digitos para autenticarte en tablets compartidas sin ingresar tu contrasena.
          </p>
          <SetPinForm />
        </div>
      )}
    </div>
  );
}
