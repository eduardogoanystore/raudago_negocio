import { publicClient } from '@/graphql/client';

const VERIFY_EMAIL = `
  mutation verifyEmail($token: String!, $user_type: String!) {
    verifyEmail(token: $token, user_type: $user_type)
  }
`;

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-background)',
  padding: '2rem',
};

const cardStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  borderRadius: '1rem',
  padding: '2rem',
  maxWidth: '420px',
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: 'var(--color-primary)',
  marginBottom: '1.5rem',
  letterSpacing: '-0.5px',
};

export default async function VerificarEmailDriverPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; type?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={logoStyle}>RaudaGo</p>
          <p style={{ color: 'var(--color-alert)', marginBottom: '0.5rem', fontWeight: 600 }}>
            Enlace de verificación no válido
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            El link que usaste no contiene un token de verificación.
          </p>
        </div>
      </div>
    );
  }

  let verified = false;

  try {
    const data = await publicClient.request<{ verifyEmail: boolean }>(VERIFY_EMAIL, {
      token,
      user_type: 'driver',
    });
    verified = data.verifyEmail === true;
  } catch {
    verified = false;
  }

  if (!verified) {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={logoStyle}>RaudaGo</p>
          <p style={{ color: 'var(--color-alert)', marginBottom: '0.5rem', fontWeight: 600 }}>
            El enlace ya fue usado o expiró.
          </p>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Si ya verificaste tu cuenta, puedes iniciar sesión en la app normalmente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <p style={logoStyle}>RaudaGo</p>
        <div style={{ marginBottom: '1rem' }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', margin: '0 auto' }}
          >
            <circle cx="24" cy="24" r="24" fill="#6C47FF" fillOpacity="0.12" />
            <path
              d="M14 24.5L20.5 31L34 17"
              stroke="#6C47FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
          ¡Correo verificado!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
          Tu cuenta como repartidor está verificada. Ya puedes iniciar sesión en la app.
        </p>
        <p style={{
          marginTop: '1.5rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-background)',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
        }}>
          Puedes cerrar esta ventana y abrir la app de RaudaGo para continuar.
        </p>
      </div>
    </div>
  );
}
