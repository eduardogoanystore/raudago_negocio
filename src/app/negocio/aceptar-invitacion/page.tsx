import { publicClient } from '@/graphql/client';
import { AcceptInvitationForm } from '@/components/auth/AcceptInvitationForm';

const VALIDATE_INVITATION_TOKEN = `
  query validateInvitationToken($token: String!) {
    validateInvitationToken(token: $token) {
      id
      invitation_email
      role
    }
  }
`;

interface InvitationData {
  id: string;
  invitation_email: string | null;
  role: string;
}

export default async function AceptarInvitacionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
        padding: '2rem',
      }}>
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}>
          <p style={{ color: 'var(--color-alert)', marginBottom: '1rem' }}>
            Token de invitacion no encontrado.
          </p>
          <a
            href="/negocio/login"
            style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            Ir al login
          </a>
        </div>
      </div>
    );
  }

  let invitation: InvitationData | null = null;
  let tokenError = false;

  try {
    const data = await publicClient.request<{ validateInvitationToken: InvitationData | null }>(
      VALIDATE_INVITATION_TOKEN,
      { token },
    );
    invitation = data.validateInvitationToken;
  } catch {
    tokenError = true;
  }

  if (tokenError || !invitation) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
        padding: '2rem',
      }}>
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}>
          <p style={{ color: 'var(--color-alert)', marginBottom: '1rem' }}>
            La invitacion no es valida o ya expiro.
          </p>
          <a
            href="/negocio/login"
            style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}
          >
            Ir al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <AcceptInvitationForm
      token={token}
      email={invitation.invitation_email ?? ''}
      role={invitation.role}
    />
  );
}
