import { getServerClient } from '@/graphql/client';
import { EmployeeRow } from '@/components/employees/EmployeeRow';
import { InviteEmployeeModal } from '@/components/employees/InviteEmployeeModal';

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

export default async function EmpleadosPage({
  params,
}: {
  params: Promise<{ negocio_slug: string }>;
}) {
  const { negocio_slug } = await params;

  let members: Member[] = [];
  let fetchError = false;

  try {
    const client = await getServerClient();
    const data = await client.request<{ businessMembers: Member[] }>(BUSINESS_MEMBERS_QUERY);
    members = data.businessMembers ?? [];
  } catch {
    fetchError = true;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Empleados</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
            {fetchError ? 'Error al cargar' : `${members.length} miembro${members.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <InviteEmployeeModal negocio_slug={negocio_slug} />
      </div>

      {fetchError && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: '#B91C1C',
        }}>
          No se pudieron cargar los empleados. Verifica tu conexion e intenta de nuevo.
        </div>
      )}

      {!fetchError && members.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>
          <p style={{ fontSize: '1rem' }}>No hay empleados registrados aun.</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          {members.map((member) => (
            <EmployeeRow key={member.id} member={member} negocio_slug={negocio_slug} />
          ))}
        </div>
      )}
    </div>
  );
}
