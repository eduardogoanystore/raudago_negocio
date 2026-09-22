'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { aceptarDocumentosLegalesAction } from '@/actions/auth';

interface LegalDoc {
  id: string;
  tipo: string;
  version: string;
  contenido: string;
}

const TIPO_LABEL: Record<string, string> = {
  terminos: 'Términos y Condiciones',
  privacidad: 'Aviso de Privacidad',
  codigo_conducta: 'Código de Conducta',
};

export function LegalReacceptModal({ docs }: { docs: LegalDoc[] }) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAccept() {
    if (!accepted) {
      setError('Debes aceptar los documentos para continuar.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await aceptarDocumentosLegalesAction(
        docs.map((d) => ({ id: d.id, tipo: d.tipo, version: d.version }))
      );
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        maxWidth: 560,
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
            Actualización de documentos legales
          </h2>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            Hemos actualizado nuestros documentos legales. Debes aceptarlos para continuar usando RaudaGo.
          </p>
        </div>

        {/* Documentos */}
        <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {docs.map((doc) => (
            <div key={doc.id} style={{
              marginBottom: '0.75rem',
              padding: '0.75rem 1rem',
              background: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>
                  {TIPO_LABEL[doc.tipo] ?? doc.tipo}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>v{doc.version}</span>
              </div>
              <a
                href={`/${doc.tipo === 'codigo_conducta' ? 'codigo-conducta' : doc.tipo}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: '#6C47FF', fontWeight: 500 }}
              >
                Leer documento →
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
          {error && (
            <p style={{
              fontSize: '0.8rem', color: '#b91c1c',
              background: '#fee2e2', borderRadius: '0.375rem',
              padding: '0.5rem 0.75rem', marginBottom: '0.75rem',
            }}>
              {error}
            </p>
          )}

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', marginBottom: '1rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              style={{ marginTop: '0.15rem', accentColor: '#6C47FF', flexShrink: 0 }}
            />
            <span style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>
              He leído y acepto los documentos listados arriba en su versión más reciente.
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={isPending}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: isPending ? '#9ca3af' : '#6C47FF',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Registrando...' : 'Acepto y continuar'}
          </button>
        </div>
      </div>
    </div>
  );
}
