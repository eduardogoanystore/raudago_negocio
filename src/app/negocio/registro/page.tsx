import { RegistroForm } from '@/components/auth/RegistroForm';

export default function RegistroPage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-background)',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        padding: '2.5rem',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            letterSpacing: '-0.03em',
          }}>
            Rauda<span style={{ color: 'var(--color-foreground)' }}>Go</span>
          </span>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            Registra tu negocio — 3 dias gratis
          </p>
        </div>
        <RegistroForm siteKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!} />
        <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
          ¿Ya tienes cuenta?{' '}
          <a href="/negocio/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Inicia sesion
          </a>
        </p>
      </div>
    </main>
  );
}
