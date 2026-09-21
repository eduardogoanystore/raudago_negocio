import ReactMarkdown from 'react-markdown'
import { publicClient } from '@/graphql/client'

const QUERY = `
  query LegalDoc($tipo: String!) {
    legalDocumentActivo(tipo: $tipo) {
      id
      version
      contenido
      publicado_en
    }
  }
`

export default async function TerminosPage() {
  let doc: { version: string; contenido: string; publicado_en: string } | null = null

  try {
    const data = await publicClient.request<{
      legalDocumentActivo: { version: string; contenido: string; publicado_en: string }
    }>(QUERY, { tipo: 'terminos' })
    doc = data.legalDocumentActivo
  } catch {
    // non-fatal — mostrar fallback
  }

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

        <div
          style={{
            background: '#FEF9C3',
            border: '1px solid #FDE047',
            borderRadius: '0.75rem',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            fontSize: '0.8rem',
            color: '#713F12',
          }}
        >
          <strong>Borrador &mdash; no validado legalmente.</strong> Este documento es un borrador de
          trabajo. Debe ser revisado por un abogado mexicano antes de entrar en vigor con usuarios
          reales.
        </div>

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#121214',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Términos y Condiciones de Uso
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B6B75', marginBottom: '2.5rem' }}>
          {doc
            ? `Versión ${doc.version} — ${new Date(doc.publicado_en).toLocaleDateString('es-MX')}`
            : 'Borrador de trabajo'}
        </p>

        {doc ? (
          <div>
            <ReactMarkdown
              components={{
                h2: ({ children }) => <h2 style={h2Style}>{children}</h2>,
                h3: ({ children }) => <h3 style={h3Style}>{children}</h3>,
                p: ({ children }) => <p style={pStyle}>{children}</p>,
                ul: ({ children }) => <ul style={ulStyle}>{children}</ul>,
                li: ({ children }) => <li style={liStyle}>{children}</li>,
                strong: ({ children }) => <strong>{children}</strong>,
                blockquote: ({ children }) => (
                  <div
                    style={{
                      background: '#FEF9C3',
                      border: '1px solid #FDE047',
                      borderRadius: '0.5rem',
                      padding: '0.875rem 1rem',
                      marginBottom: '1rem',
                      fontSize: '0.8rem',
                      color: '#713F12',
                    }}
                  >
                    {children}
                  </div>
                ),
              }}
            >
              {doc.contenido}
            </ReactMarkdown>
          </div>
        ) : (
          <p style={pStyle}>Contenido no disponible temporalmente.</p>
        )}

        <footer
          style={{
            borderTop: '1px solid #D9D4CA',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#6B6B75',
          }}
        >
          <a href="/" style={footerLinkStyle}>
            &larr; Inicio
          </a>
          <a href="/privacidad" style={footerLinkStyle}>
            Aviso de Privacidad
          </a>
          <a href="/codigo-conducta" style={footerLinkStyle}>
            Código de Conducta
          </a>
        </footer>
      </div>
    </main>
  )
}

const h2Style: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 700,
  color: '#121214',
  marginBottom: '0.75rem',
  marginTop: 0,
}

const h3Style: React.CSSProperties = {
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#121214',
  marginBottom: '0.5rem',
  marginTop: 0,
}

const pStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#3A3A44',
  lineHeight: 1.75,
  marginBottom: '0.875rem',
  marginTop: 0,
}

const ulStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  margin: 0,
}

const liStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#3A3A44',
  lineHeight: 1.75,
  marginBottom: '0.5rem',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#6C47FF',
  fontWeight: 600,
  textDecoration: 'none',
}
