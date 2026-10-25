'use client';

import { useState } from 'react';

// ─── Metas default para colonias sin zona ─────────────────────────────────────

const DEFAULT_META_NEGOCIOS = 20;
const DEFAULT_META_REPARTIDORES = 40;

// ─── Props ────────────────────────────────────────────────────────────────────

type ZonaEsperaViewProps =
  | {
      variant: 'zona_espera';
      zona: {
        name: string;
        status: 'pre_lanzamiento' | 'pausada';
        meta_negocios_apertura: number;
        meta_repartidores_apertura: number;
        negocios_en_espera: number;
        repartidores_en_espera: number;
      };
      businessSlug: string;
    }
  | {
      variant: 'sin_cobertura';
      neighborhood: string;
      negocios_en_colonia: number;
      repartidores_en_colonia: number;
      businessSlug: string;
    };

// ─── Barra de progreso doble ──────────────────────────────────────────────────

function DualProgressBar({
  negociosActual,
  negociosMeta,
  repartidoresActual,
  repartidoresMeta,
}: {
  negociosActual: number;
  negociosMeta: number;
  repartidoresActual: number;
  repartidoresMeta: number;
}) {
  const negociosPct = negociosMeta > 0 ? Math.min(100, (negociosActual / negociosMeta) * 100) : 0;
  const repartidoresPct =
    repartidoresMeta > 0 ? Math.min(100, (repartidoresActual / repartidoresMeta) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Negocios */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <span style={{ fontSize: 13, color: '#57544f' }}>Negocios</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#121214' }}>
            {negociosActual} / {negociosMeta}
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: '#DED7C9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${negociosPct}%`,
              borderRadius: 999,
              background: negociosPct >= 100 ? '#22C55E' : '#6C47FF',
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* Repartidores */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <span style={{ fontSize: 13, color: '#57544f' }}>Repartidores</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#121214' }}>
            {repartidoresActual} / {repartidoresMeta}
          </span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 999,
            background: '#DED7C9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${repartidoresPct}%`,
              borderRadius: 999,
              background: repartidoresPct >= 100 ? '#22C55E' : '#6C47FF',
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ZonaEsperaView(props: ZonaEsperaViewProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://raudago.com/registro?ref=${props.businessSlug}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // ── Valores derivados según variante ────────────────────────────────────────

  const isZonaEspera = props.variant === 'zona_espera';

  const titulo = isZonaEspera
    ? 'Tu zona aún no está disponible'
    : 'Tu colonia aún no tiene cobertura';

  const subtitulo = isZonaEspera
    ? 'Pero ya estamos trabajando en ello. Cuando esté lista te avisamos por email y WhatsApp.'
    : 'Estamos expandiendo. Te avisamos cuando lleguemos a tu zona.';

  const conteoTexto = isZonaEspera
    ? `${props.zona.negocios_en_espera} negocios y ${props.zona.repartidores_en_espera} repartidores registrados en tu zona`
    : `En ${props.neighborhood} ya hay ${props.negocios_en_colonia} negocios y ${props.repartidores_en_colonia} repartidores registrados`;

  const negociosActual = isZonaEspera ? props.zona.negocios_en_espera : props.negocios_en_colonia;
  const negociosMeta = isZonaEspera ? props.zona.meta_negocios_apertura : DEFAULT_META_NEGOCIOS;
  const repartidoresActual = isZonaEspera
    ? props.zona.repartidores_en_espera
    : props.repartidores_en_colonia;
  const repartidoresMeta = isZonaEspera
    ? props.zona.meta_repartidores_apertura
    : DEFAULT_META_REPARTIDORES;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#FFFDFA',
          borderRadius: 24,
          border: '1px solid #DED7C9',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ display: 'inline-block' }}>
            <img src="/logo-full.svg" alt="RaudaGo" style={{ height: 32 }} />
          </a>
        </div>

        {/* Icono, badge y titulo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#F1EDFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6C47FF"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
          </div>

          {/* Badge "Pronto" — solo en variante zona_espera */}
          {isZonaEspera && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#121214',
                }}
              >
                {props.zona.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#92400E',
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  borderRadius: 999,
                  padding: '2px 10px',
                }}
              >
                Pronto
              </span>
            </div>
          )}

          <h1
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#121214',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {titulo}
          </h1>

          <p style={{ fontSize: 15, color: '#57544f', lineHeight: 1.6, margin: 0, maxWidth: 380 }}>
            {subtitulo}
          </p>
        </div>

        {/* Conteos y barra de progreso */}
        <div
          style={{
            background: '#F3EFE7',
            border: '1px solid #DED7C9',
            borderRadius: 16,
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <p style={{ fontSize: 13, color: '#57544f', margin: 0, lineHeight: 1.5 }}>
            {conteoTexto}
          </p>

          <DualProgressBar
            negociosActual={negociosActual}
            negociosMeta={negociosMeta}
            repartidoresActual={repartidoresActual}
            repartidoresMeta={repartidoresMeta}
          />
        </div>

        {/* Enlace de referido */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <p style={{ fontSize: 14, color: '#57544f', margin: 0 }}>
            Invita a otros negocios a unirse:
          </p>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              height: 44,
              borderRadius: 10,
              border: '1.5px solid #DED7C9',
              background: copied ? '#DCFCE7' : '#FFFDFA',
              color: copied ? '#166534' : '#121214',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {copied ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Enlace copiado
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copiar enlace
              </>
            )}
          </button>
          <p style={{ fontSize: 12, color: '#8E8B93', margin: 0, wordBreak: 'break-all' }}>
            {referralUrl}
          </p>
        </div>
      </div>
    </main>
  );
}
