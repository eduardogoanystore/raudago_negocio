'use client';

interface OnboardingHeaderProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle?: string;
}

const STEPS = [
  { num: 1, label: 'Datos' },
  { num: 2, label: 'Sucursal' },
  { num: 3, label: 'Plan' },
];

export function OnboardingHeader({ step, title, subtitle }: OnboardingHeaderProps) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* Logo */}
      <div style={{ marginBottom: 28 }}>
        <a
          href="/"
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#6C47FF',
            letterSpacing: '-0.03em',
            textDecoration: 'none',
          }}
        >
          Rauda<span style={{ color: '#121214' }}>Go</span>
        </a>
      </div>

      {/* Steps */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          marginBottom: 32,
        }}
      >
        {STEPS.map((s, idx) => {
          const isPast = s.num < step;
          const isActive = s.num === step;
          const isFuture = s.num > step;
          const isLast = idx === STEPS.length - 1;

          return (
            <div
              key={s.num}
              style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}
            >
              {/* Step circle + label */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: isPast ? '#C6FF3D' : isActive ? '#6C47FF' : '#E5E0D8',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  {isPast ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121214" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive ? '#ffffff' : '#8E8B93',
                      }}
                    >
                      {s.num}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#121214' : isFuture ? '#8E8B93' : '#57544f',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line — not after last step */}
              {!isLast && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    marginBottom: 18,
                    background: isPast ? '#6C47FF' : '#DED7C9',
                    transition: 'background 0.2s',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: '#121214',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          margin: 0,
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 15, color: '#57544f', margin: 0, lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
