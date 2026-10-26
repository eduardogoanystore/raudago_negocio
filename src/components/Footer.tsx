'use client'

import { LEGAL } from '@/config/legal'

/**
 * variant="dark"  — fondo #121214, usado en landing e inicio de repartidores
 * variant="light" — fondo #F3EFE7, usado en páginas legales
 */
export default function Footer({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  if (variant === 'light') {
    return (
      <footer
        style={{
          borderTop: '1px solid #D9D4CA',
          paddingTop: '1.5rem',
          marginTop: '3rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.8rem',
          color: '#6B6B75',
        }}
      >
        <div>
          {'© 2026 RaudaGo · Operado por '}
          {LEGAL.nombre}
          {' · Culiacán, Sinaloa · Tel. '}
          <a href={`tel:${LEGAL.telefono}`} style={lightLinkStyle}>
            {LEGAL.telefono}
          </a>
          {' · '}
          <a href={`mailto:${LEGAL.correo}`} style={lightLinkStyle}>
            {LEGAL.correo}
          </a>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <a href="/privacidad" style={lightLinkStyle}>
            Aviso de Privacidad
          </a>
          <a href="/terminos" style={lightLinkStyle}>
            Términos y Condiciones
          </a>
          <a href="/contacto" style={lightLinkStyle}>
            Contacto
          </a>
        </div>
      </footer>
    )
  }

  // variant === 'dark'
  return (
    <footer
      style={{
        background: '#121214',
        borderTop: '1px solid #2A2A31',
        padding: '26px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 13, color: '#57545C' }}>
          {'© 2026 RaudaGo · Operado por '}
          {LEGAL.nombre}
          {' · Culiacán, Sinaloa · Tel. '}
          <a href={`tel:${LEGAL.telefono}`} style={darkLinkStyle}>
            {LEGAL.telefono}
          </a>
          {' · '}
          <a href={`mailto:${LEGAL.correo}`} style={darkLinkStyle}>
            {LEGAL.correo}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
          <a href="/privacidad" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
            Aviso de Privacidad
          </a>
          <a href="/terminos" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
            Términos y Condiciones
          </a>
          <a href="/contacto" style={{ fontSize: 14, color: '#8E8B93', fontWeight: 500 }}>
            Contacto
          </a>
        </div>
      </div>
    </footer>
  )
}

const darkLinkStyle: React.CSSProperties = {
  color: '#8E8B93',
  fontWeight: 500,
  textDecoration: 'none',
}

const lightLinkStyle: React.CSSProperties = {
  color: '#6C47FF',
  fontWeight: 600,
  textDecoration: 'none',
}
