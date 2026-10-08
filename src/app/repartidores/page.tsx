import Image from 'next/image';
import { headers } from 'next/headers';
import { publicClient } from '@/graphql/client';
import { FaqSection, RegistroForm } from './RepartidorLandingClient';

// Cambiar a 'store' cuando la app esté en las tiendas
const CTA_MODE: 'form' | 'store' = 'form';

const LANDING_QUERY = `
  query repartidoresLanding {
    subscriptionPlans(subscriberType: DRIVER) {
      id
      key
      name
      priceWeeklyCents
      promoPriceCents
      trialDays
      promoMonths
    }
    zones {
      id
      name
    }
  }
`;

interface DriverPlan {
  id: string;
  key: string;
  name: string;
  priceWeeklyCents: number;
  promoPriceCents: number | null;
  trialDays: number;
  promoMonths: number;
}

interface Zone {
  id: string;
  name: string;
}

export default async function RepartidorLanding() {
  let plan: DriverPlan | null = null;
  let zones: string[] = [];
  try {
    const data = await publicClient.request<{ subscriptionPlans: DriverPlan[]; zones: Zone[] }>(
      LANDING_QUERY,
    );
    plan = data.subscriptionPlans?.[0] ?? null;
    zones = (data.zones ?? []).map((z) => z.name);
  } catch {
    // Si falla el fetch, se muestran valores vacíos
  }

  // Ciudad del visitante vía header de Cloudflare (solo disponible en producción)
  const headersList = await headers();
  const city = headersList.get('cf-ipcity') ?? 'Culiacán';

  const trialDays = plan ? `${plan.trialDays} días` : '7 días';
  const promoPrice = plan?.promoPriceCents ? `$${(plan.promoPriceCents / 100).toFixed(2)}` : '$82.50';
  const promoWeeks = plan ? plan.promoMonths * 4 : 4;
  const promoLength = `${promoWeeks} semanas`;
  const normalPrice = plan?.priceWeeklyCents ? `$${(plan.priceWeeklyCents / 100).toFixed(0)}` : '$150';

  return (
    <div style={{ background: '#F3EFE7', minHeight: '100vh' }}>

      {/* ── Responsive styles ── */}
      <style>{`
        #rep-hero-grid  { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px; }
        #rep-how-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 16px; }
        #rep-vs-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        #rep-offer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 14px; }
        #rep-reg-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 36px; }
        @media (max-width: 600px) {
          #rep-hero-title  { font-size: clamp(34px, 9vw, 54px) !important; }
          #rep-offer-title { font-size: clamp(28px, 7vw, 40px) !important; }
        }
      `}</style>

      {/* ── Nav sticky ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(243,239,231,.94)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #DED7C9' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/logo-full.svg" alt="RaudaGo" width={120} height={42} priority />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8B93', paddingLeft: 10, borderLeft: '1px solid #DED7C9' }}>
              Repartidores
            </span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <a href="#registro" style={{ height: 42, padding: '0 20px', borderRadius: 999, background: '#6C47FF', color: '#ffffff', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              Regístrate gratis
            </a>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 24px 96px', boxSizing: 'border-box' }}>
        <div id="rep-hero-grid" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'inline-flex' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: '#C6FF3D', color: '#121214', fontSize: 13, fontWeight: 700, padding: '6px 14px', borderRadius: 999, letterSpacing: '.01em' }}>
                {trialDays} gratis · sin tarjeta
              </span>
            </div>
            <h1 id="rep-hero-title" style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 54, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-.04em', color: '#121214', margin: 0 }}>
              Todos los pedidos de {city} en un solo lugar. Y sabes cuánto cobras antes de aceptar.
            </h1>
            <p style={{ fontSize: 19, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
              Un solo app. Ves el precio, la distancia y el destino antes de decir que sí. Sin regatear, sin sorpresas, sin dictar nada por audio.
            </p>
            <div>
              <a href="#registro" style={{ height: 58, padding: '0 32px', borderRadius: 999, background: '#6C47FF', color: '#ffffff', fontSize: 17, fontWeight: 700, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                Quiero repartir con RaudaGo →
              </a>
            </div>
            <p style={{ fontSize: 14, color: '#8E8B93', margin: 0 }}>
              Sin dejar tu grupo actual · Sin tarjeta para empezar
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', aspectRatio: '4/5', maxHeight: 580, borderRadius: 28, overflow: 'hidden', position: 'relative' }}>
              <Image src="/images/repartidor.png" alt="Repartidor RaudaGo en moto" fill style={{ objectFit: 'fill' }} priority />
            </div>
            <div style={{ position: 'absolute', bottom: 24, left: -16, background: '#121214', borderRadius: 18, padding: '16px 20px', minWidth: 240, boxShadow: '0 12px 40px rgba(0,0,0,.28)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                Pedido disponible
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#F3EFE7', marginBottom: 8 }}>
                Sushi Kazán → Las Quintas
              </div>
              <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 22, fontWeight: 700, color: '#C6FF3D', marginBottom: 10 }}>
                $75
              </div>
              <div style={{ fontSize: 13, color: '#8E8B93' }}>7.8 km · tú cobras esto</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ── */}
      <section style={{ background: '#FFFDFA', borderTop: '1px solid #DED7C9', borderBottom: '1px solid #DED7C9', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6C47FF', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Cómo funciona
            </div>
            <h2 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-.03em', color: '#121214', lineHeight: 1.1, margin: 0 }}>
              Cuatro pasos y ya estás repartiendo
            </h2>
          </div>
          <div id="rep-how-grid">
            {[
              { bg: '#F3EFE7', dark: false, num: '1.', title: 'Te registras', desc: 'Nombre, WhatsApp y zona. Sin trámites largos, sin contrato. Listo en menos de 2 minutos.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> },
              { bg: '#F3EFE7', dark: false, num: '2.', title: 'Ves todos los pedidos', desc: 'Cada pedido muestra el negocio, el destino, la distancia y lo que cobras. Antes de tocar nada.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
              { bg: '#F3EFE7', dark: false, num: '3.', title: 'Tomas el que te convenga', desc: 'Aceptas solo lo que vale tu tiempo. Sin presiones, sin turnos forzados, sin tener que responder rápido en un chat.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C47FF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg> },
              { bg: '#C6FF3D', dark: true, num: '4.', title: 'Cobras lo que ya viste', desc: 'Sin regateos al llegar. El precio que viste en la app es el que cobras, siempre.', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
            ].map((card) => (
              <div key={card.num} style={{ background: card.bg, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16, border: card.dark ? 'none' : '1px solid #DED7C9' }}>
                <div>{card.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: '#121214', letterSpacing: '-.02em', lineHeight: 1.2, margin: 0 }}>
                  {card.num} {card.title}
                </h3>
                <p style={{ fontSize: 15, color: card.dark ? '#3a3a3a' : '#57544f', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hoy vs. RaudaGo ── */}
      <section style={{ padding: '96px 24px', maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-.03em', color: '#121214', lineHeight: 1.1, margin: 0 }}>
            El grupo de WhatsApp vs. RaudaGo
          </h2>
        </div>
        <div id="rep-vs-grid">
          <div style={{ background: '#FFFDFA', border: '1px solid #DED7C9', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.08em', textTransform: 'uppercase' }}>Hoy, en el grupo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['No sabes cuánto te pagan antes de aceptar', 'Tienes que responder rápido o alguien más se lo lleva', 'Negocias el precio cada vez con cada negocio', 'El historial se pierde entre audios y stickers'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E5E0D8', display: 'grid', placeItems: 'center', flex: 'none', marginTop: 2 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8E8B93" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#57544f', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#121214', borderRadius: 20, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#C6FF3D', letterSpacing: '.08em', textTransform: 'uppercase' }}>Con RaudaGo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Precio, distancia y destino visibles antes de aceptar', 'Sin presión: tomas el pedido cuando quieres', 'Tarifa fija por kilómetro, la misma para todos', 'Historial completo de cada entrega en la app'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C6FF3D', display: 'grid', placeItems: 'center', flex: 'none', marginTop: 2 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  </div>
                  <span style={{ fontSize: 16, color: '#DED7C9', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Oferta ── */}
      <section style={{ background: '#6C47FF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              Precio de lanzamiento
            </div>
            <h2 id="rep-offer-title" style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 40, fontWeight: 700, letterSpacing: '-.03em', color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
              Empieza gratis. Paga menos mientras la plataforma crece.
            </h2>
          </div>

          <div id="rep-offer-grid" style={{ marginBottom: 40 }}>
            {/* PASO 1 */}
            <div style={{ background: '#C6FF3D', borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4B2FD6', letterSpacing: '.08em', textTransform: 'uppercase' }}>PASO 1</div>
              <div style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: '#121214', letterSpacing: '-.04em', lineHeight: 1 }}>Gratis</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#121214' }}>Los primeros {trialDays}</div>
              <p style={{ fontSize: 14, color: '#3a3a3a', lineHeight: 1.6, margin: 0 }}>
                Sin tarjeta, sin compromiso. Entra, ve los pedidos y decide si vale la pena.
              </p>
            </div>

            {/* PASO 2 */}
            <div style={{ background: '#FFFDFA', borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10, border: '1px solid rgba(255,255,255,.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#6C47FF', letterSpacing: '.08em', textTransform: 'uppercase' }}>PASO 2</div>
              <div style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: '#121214', letterSpacing: '-.04em', lineHeight: 1 }}>
                {promoPrice}<span style={{ fontSize: 16, fontWeight: 600, color: '#57544f' }}>/semana</span>
              </div>
              <div style={{ fontSize: 12, color: '#9B9590' }}>IVA incluido</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#121214' }}>Durante {promoLength}</div>
              <p style={{ fontSize: 14, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
                Precio de lanzamiento para los primeros repartidores que se suman.
              </p>
            </div>

            {/* PASO 3 */}
            <div style={{ background: '#121214', borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.08em', textTransform: 'uppercase' }}>PASO 3</div>
              <div style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 36, fontWeight: 800, color: '#F3EFE7', letterSpacing: '-.04em', lineHeight: 1 }}>
                {normalPrice}<span style={{ fontSize: 16, fontWeight: 600, color: '#8E8B93' }}>/semana</span>
              </div>
              <div style={{ fontSize: 12, color: '#6B6B75' }}>IVA incluido</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#DED7C9' }}>Precio normal</div>
              <p style={{ fontSize: 14, color: '#8E8B93', lineHeight: 1.6, margin: 0 }}>
                Lo mismo que ya pagas hoy en los grupos, con la plataforma consolidada.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a href="#registro" style={{ height: 58, padding: '0 40px', borderRadius: 999, background: '#C6FF3D', color: '#121214', fontSize: 17, fontWeight: 700, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              Empezar mis {trialDays} gratis
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: '#FFFDFA', borderTop: '1px solid #DED7C9', padding: '96px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 38, fontWeight: 700, letterSpacing: '-.03em', color: '#121214', lineHeight: 1.1, margin: 0 }}>
              Preguntas frecuentes
            </h2>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* ── Registro ── */}
      <section id="registro" style={{ background: '#FFFDFA', borderTop: '1px solid #DED7C9', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box' }}>
          <div id="rep-reg-grid" style={{ alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 42, fontWeight: 700, letterSpacing: '-.04em', color: '#121214', lineHeight: 1.08, margin: 0 }}>
                Empieza a ver pedidos hoy mismo.
              </h2>
              <p style={{ fontSize: 18, color: '#57544f', lineHeight: 1.6, margin: 0 }}>
                {trialDays} gratis, sin tarjeta, sin dejar tu grupo actual. Entra, revisa cómo se ve la app y decide si quieres seguir.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Ves precio y destino antes de aceptar', 'Tarifa fija, sin regateos', 'Sin contrato, cancelas cuando quieras'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#C6FF3D', display: 'grid', placeItems: 'center', flex: 'none' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <span style={{ fontSize: 15, color: '#57544f' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#F3EFE7', borderRadius: 24, padding: '36px 32px' }}>
              {CTA_MODE === 'form' ? (
                <RegistroForm zones={zones} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                  <h3 style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 20, fontWeight: 700, color: '#121214', margin: 0, letterSpacing: '-.02em' }}>
                    Descarga la app y regístrate ahí
                  </h3>
                  <p style={{ fontSize: 15, color: '#57544f', margin: 0, lineHeight: 1.6 }}>Disponible en App Store y Google Play.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    <a href="#app-store" style={{ height: 52, borderRadius: 14, background: '#121214', color: '#ffffff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      App Store
                    </a>
                    <a href="#google-play" style={{ height: 52, borderRadius: 14, background: '#121214', color: '#ffffff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      Google Play
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#121214', borderTop: '1px solid #2A2A31', padding: '56px 24px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/icon.svg" alt="RaudaGo" width={30} height={30} />
            <div>
              <div style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: '#F3EFE7', letterSpacing: '-.02em' }}>RaudaGo</div>
              <div style={{ fontSize: 12, color: '#8E8B93', marginTop: 1 }}>Culiacán, Sinaloa</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Contacto</div>
            <a href="https://wa.me/526672277437" target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>WhatsApp 667 227 7437</a>
            <a href="mailto:jesus.ed13@gmail.com" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>jesus.ed13@gmail.com</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8E8B93', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>Legal</div>
            <a href="/terminos" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Términos</a>
            <a href="/cancelacion" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Cancelación</a>
            <a href="/privacidad" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Privacidad</a>
            <a href="/codigo-conducta" style={{ fontSize: 14, color: '#DED7C9', fontWeight: 500 }}>Código de Conducta</a>
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: '40px auto 0', boxSizing: 'border-box', paddingTop: 24, borderTop: '1px solid #2A2A31', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#57544f' }}>© 2026 RaudaGo</span>
          <a href="/" style={{ fontSize: 13, color: '#8E8B93', fontWeight: 500 }}>¿Tienes un negocio? Conoce RaudaGo Negocios</a>
        </div>
      </footer>

    </div>
  );
}
