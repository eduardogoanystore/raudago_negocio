'use client';

import { useState } from 'react';

interface Props {
  businessSlug: string;
}

export function ReferralCopyButton({ businessSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://raudago.com/registro?ref=${businessSlug}`;

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        onClick={handleCopy}
        style={{
          height: 48,
          borderRadius: 12,
          border: '1.5px solid #DED7C9',
          background: copied ? '#DCFCE7' : '#FFFDFA',
          color: copied ? '#166534' : '#121214',
          fontSize: 15,
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
              aria-hidden="true"
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
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copiar mi link
          </>
        )}
      </button>
      <p style={{ fontSize: 12, color: '#8E8B93', margin: 0, wordBreak: 'break-all' }}>
        {referralUrl}
      </p>
    </div>
  );
}
