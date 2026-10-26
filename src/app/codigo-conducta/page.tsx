import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { publicClient } from '@/graphql/client'
import Footer from '@/components/Footer'

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

export default async function CodigoConductaPage() {
  let doc: { version: string; contenido: string; publicado_en: string } | null = null

  try {
    const data = await publicClient.request<{
      legalDocumentActivo: { version: string; contenido: string; publicado_en: string }
    }>(QUERY, { tipo: 'codigo-conducta' })
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

        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#121214',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Código de Conducta
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B6B75', marginBottom: '2.5rem' }}>
          {doc
            ? `Versión ${doc.version} — ${new Date(doc.publicado_en).toLocaleDateString("es-MX")}`
            : ''}
        </p>

        {doc ? (
          <div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => <h2 style={h2Style}>{children}</h2>,
                h3: ({ children }) => <h3 style={h3Style}>{children}</h3>,
                p: ({ children }) => <p style={pStyle}>{children}</p>,
                ul: ({ children }) => <ul style={ulStyle}>{children}</ul>,
                ol: ({ children }) => <ol style={olStyle}>{children}</ol>,
                li: ({ children }) => <li style={liStyle}>{children}</li>,
                strong: ({ children }) => <strong>{children}</strong>,
                hr: () => <hr style={hrStyle} />,
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
                table: ({ children }) => <table style={tableStyle}>{children}</table>,
                thead: ({ children }) => <thead style={theadStyle}>{children}</thead>,
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr style={trStyle}>{children}</tr>,
                th: ({ children }) => <th style={thStyle}>{children}</th>,
                td: ({ children }) => <td style={tdStyle}>{children}</td>,
              }}
            >
              {doc.contenido}
            </ReactMarkdown>
          </div>
        ) : (
          <p style={pStyle}>Contenido no disponible temporalmente.</p>
        )}

        <Footer variant="light" />
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
  marginBottom: '0.875rem',
}

const olStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  margin: 0,
  marginBottom: '0.875rem',
}

const liStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#3A3A44',
  lineHeight: 1.75,
  marginBottom: '0.5rem',
}

const hrStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #D9D4CA',
  margin: '1.5rem 0',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '1rem',
  fontSize: '0.875rem',
}

const theadStyle: React.CSSProperties = {
  borderBottom: '2px solid #D9D4CA',
}

const trStyle: React.CSSProperties = {
  borderBottom: '1px solid #E8E3D9',
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  textAlign: 'left',
  fontWeight: 700,
  color: '#121214',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  color: '#3A3A44',
  verticalAlign: 'top',
}
