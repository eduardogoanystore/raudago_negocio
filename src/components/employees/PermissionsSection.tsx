'use client';

import { useState, useTransition } from 'react';
import { PermissionsEditor } from './PermissionsEditor';
import { updateMemberPermissionsAction } from '@/actions/employees';
import { getEffectivePermissions } from '@/utils/permissions';

type Props = {
  memberId: string;
  negocio_slug: string;
  role: string;
  initialOverrides: string[];
  readonly?: boolean;
};

export function PermissionsSection({ memberId, negocio_slug, role, initialOverrides, readonly }: Props) {
  const [overrides, setOverrides] = useState<string[]>(initialOverrides);
  const [isDirty, setIsDirty] = useState(false);
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const effectivePermissions = getEffectivePermissions(role, overrides);

  function handleChange(newOverrides: string[]) {
    setOverrides(newOverrides);
    setIsDirty(true);
    setResult(null);
  }

  function handleSave() {
    setResult(null);
    startTransition(async () => {
      const res = await updateMemberPermissionsAction(memberId, negocio_slug, overrides);
      setResult(res);
      if (res.success) setIsDirty(false);
    });
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <PermissionsEditor
        role={role}
        overrides={overrides}
        effectivePermissions={effectivePermissions}
        readonly={readonly}
        onChange={handleChange}
      />

      {!readonly && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          {result?.success && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '0.5rem',
              padding: '0.65rem 1rem',
              marginBottom: '0.875rem',
              fontSize: '0.875rem',
              color: '#15803D',
            }}>
              Permisos guardados correctamente.
            </div>
          )}
          {result?.error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '0.5rem',
              padding: '0.65rem 1rem',
              marginBottom: '0.875rem',
              fontSize: '0.875rem',
              color: '#B91C1C',
            }}>
              {result.error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            style={{
              padding: '0.65rem 1.5rem',
              background: isPending || !isDirty ? 'var(--color-border)' : 'var(--color-primary)',
              color: isPending || !isDirty ? 'var(--color-muted)' : 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isPending || !isDirty ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Guardando...' : 'Guardar permisos'}
          </button>
        </div>
      )}
    </div>
  );
}
