import { LEGAL } from '@/config/legal'
import Footer from '@/components/Footer'

export default function ContactoPage() {
  return (
    <main style={{ background: '#F3EFE7', minHeight: '100vh', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a
          href="/"
          style={{
            fontSize: '0.875rem',
            color: '#6C47FF',
            fontWeight: 600,
            marginBottom: '2rem',
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          &larr; RaudaGo
        </a>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#121214',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Contacto
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B6B75', marginBottom: '2.5rem' }}>
          {LEGAL.comercial} es la plataforma de reparto para negocios en Culiacán.
          Conectamos negocios con repartidores independientes en tu zona.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.9rem',
            color: '#3A3A44',
            lineHeight: 1.75,
          }}
        >
          <div>
            <strong>Responsable:</strong> {LEGAL.nombre}
          </div>
          <div>
            <strong>Ubicación:</strong> Culiacán, Sinaloa, México ·{' '}
            <a href="/privacidad" style={linkStyle}>
              Domicilio del responsable
            </a>
          </div>
          <div>
            <strong>Teléfono:</strong>{' '}
            <a href={`tel:${LEGAL.telefono}`} style={linkStyle}>
              {LEGAL.telefono}
            </a>
          </div>
          <div>
            <strong>Correo:</strong>{' '}
            <a href={`mailto:${LEGAL.correo}`} style={linkStyle}>
              {LEGAL.correo}
            </a>
          </div>
          <div>
            <strong>Sitio:</strong>{' '}
            <a href={LEGAL.sitio} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {LEGAL.sitio}
            </a>
          </div>
        </div>

        <Footer variant="light" />
      </div>
    </main>
  )
}

const linkStyle: React.CSSProperties = {
  color: '#6C47FF',
  fontWeight: 600,
  textDecoration: 'none',
}
