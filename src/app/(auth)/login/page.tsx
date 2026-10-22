import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-background)',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        padding: '2.5rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <a href="/" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            <img src="/logo-full.svg" alt="RaudaGo" style={{ height: 36 }} />
          </a>
          <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Accede a tu negocio
          </p>
        </div>
        <LoginForm siteKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!} />
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          ¿No tienes cuenta?{' '}
          <a href="/registro" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Regístrate gratis
          </a>
        </p>
      </div>
    </main>
  );
}
