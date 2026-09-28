export default function CancelacionPage() {
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
          Política de Cancelación y Reembolsos
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B6B75', marginBottom: '2.5rem' }}>
          Vigente a partir del 1 de octubre de 2026
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section>
            <h2 style={h2Style}>Modalidad de cobro</h2>
            <p style={pStyle}>
              RaudaGo opera bajo un modelo de suscripción <strong>prepago semanal</strong>. El
              servicio se activa al confirmar el pago del período en curso. No se genera deuda ni
              cargo retroactivo por ningún motivo.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>Cancelación</h2>
            <p style={pStyle}>
              Puedes cancelar tu suscripción en cualquier momento desde tu panel de cuenta. Al
              cancelar:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>
                El servicio permanece activo hasta el término de la semana ya pagada.
              </li>
              <li style={liStyle}>No se realizan cargos adicionales tras la cancelación.</li>
              <li style={liStyle}>
                No hay penalizaciones ni permanencia mínima obligatoria.
              </li>
              <li style={liStyle}>
                Si no se realiza el siguiente pago, la cuenta se pausa automáticamente. Puedes
                reactivarla en cualquier momento pagando el período correspondiente.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={h2Style}>Reembolsos</h2>
            <p style={pStyle}>
              Dado que el servicio es de acceso inmediato una vez activado,{' '}
              <strong>
                no se emiten reembolsos por semanas ya iniciadas o parcialmente utilizadas
              </strong>
              .
            </p>
            <p style={pStyle}>
              <strong>Excepción:</strong> si RaudaGo presenta una interrupción total del servicio
              por causas imputables a la plataforma por más de 48 horas continuas, el cliente
              podrá solicitar un crédito proporcional al tiempo no disponible. Las solicitudes
              deben enviarse a{' '}
              <a href="mailto:jesus.ed13@gmail.com" style={linkStyle}>
                jesus.ed13@gmail.com
              </a>{' '}
              dentro de los 7 días naturales siguientes al incidente.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>Período de prueba</h2>
            <p style={pStyle}>
              Las semanas de prueba gratuita no generan cargo. Si no se cancela antes del término
              del período de prueba, se aplica el cobro de la suscripción seleccionada.
            </p>
          </section>

          <section>
            <h2 style={h2Style}>Contacto</h2>
            <p style={pStyle}>
              Para dudas sobre cobros o cancelaciones:
            </p>
            <ul style={ulStyle}>
              <li style={liStyle}>
                Correo:{' '}
                <a href="mailto:jesus.ed13@gmail.com" style={linkStyle}>
                  jesus.ed13@gmail.com
                </a>
              </li>
              <li style={liStyle}>
                WhatsApp:{' '}
                <a href="https://wa.me/526672277437" style={linkStyle}>
                  +52 667 227 7437
                </a>
              </li>
            </ul>
          </section>
        </div>

        <footer
          style={{
            borderTop: '1px solid #D9D4CA',
            paddingTop: '1.5rem',
            marginTop: '3rem',
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
          <a href="/terminos" style={footerLinkStyle}>
            Términos y Condiciones
          </a>
          <a href="/privacidad" style={footerLinkStyle}>
            Aviso de Privacidad
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

const pStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#3A3A44',
  lineHeight: 1.75,
  marginBottom: '0.875rem',
  marginTop: 0,
}

const ulStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  margin: '0 0 0.875rem 0',
}

const liStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#3A3A44',
  lineHeight: 1.75,
  marginBottom: '0.5rem',
}

const linkStyle: React.CSSProperties = {
  color: '#6C47FF',
  fontWeight: 600,
  textDecoration: 'none',
}

const footerLinkStyle: React.CSSProperties = {
  color: '#6C47FF',
  fontWeight: 600,
  textDecoration: 'none',
}
