'use client';

import { PERMISSIONS_GROUPS } from '@/utils/permissions';

type Props = {
  rolePermissions: string[];
  overrides: string[];
  effectivePermissions: string[];
  readonly?: boolean;
  onChange: (overrides: string[]) => void;
};

export function PermissionsEditor({ rolePermissions, overrides, effectivePermissions, readonly, onChange }: Props) {
  const roleDefaults = rolePermissions;

  function handleToggle(permKey: string, currentlyActive: boolean) {
    const fromRole = roleDefaults.includes(permKey);
    // Role-granted permissions cannot be removed
    if (fromRole) return;

    if (currentlyActive) {
      // Remove from overrides
      onChange(overrides.filter((p) => p !== permKey));
    } else {
      // Add to overrides
      onChange([...overrides, permKey]);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Permisos</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
          Los permisos del rol se muestran en gris. Los permisos adicionales en azul.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {PERMISSIONS_GROUPS.map((group) => {
          const activeCount = group.permissions.filter((p) =>
            effectivePermissions.includes(p.key)
          ).length;

          return (
            <div
              key={group.key}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '0.625rem',
                overflow: 'hidden',
              }}
            >
              {/* Group header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--color-background)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{group.label}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: activeCount === group.permissions.length ? 'var(--color-primary)' : 'var(--color-muted)',
                  background: activeCount === group.permissions.length ? '#EEF2FF' : 'var(--color-border)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '9999px',
                }}>
                  {activeCount}/{group.permissions.length} activos
                </span>
              </div>

              {/* Permissions list */}
              <div style={{ background: 'var(--color-surface)' }}>
                {group.permissions.map((perm, idx) => {
                  const isActive = effectivePermissions.includes(perm.key);
                  const fromRole = roleDefaults.includes(perm.key);
                  const isDisabled = readonly || fromRole;

                  return (
                    <label
                      key={perm.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderTop: idx === 0 ? 'none' : '1px solid var(--color-border)',
                        cursor: isDisabled ? 'default' : 'pointer',
                        opacity: isDisabled && !isActive ? 0.45 : 1,
                      }}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isActive}
                        disabled={isDisabled}
                        onChange={() => handleToggle(perm.key, isActive)}
                        style={{
                          width: '16px',
                          height: '16px',
                          flexShrink: 0,
                          cursor: isDisabled ? 'default' : 'pointer',
                          accentColor: fromRole ? '#9CA3AF' : 'var(--color-primary)',
                        }}
                      />

                      {/* Label + source indicator */}
                      <span style={{ flex: 1, fontSize: '0.875rem' }}>{perm.label}</span>

                      {isActive && (
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          background: fromRole ? '#F3F4F6' : '#EEF2FF',
                          color: fromRole ? '#6B7280' : 'var(--color-primary)',
                          flexShrink: 0,
                        }}>
                          {fromRole ? 'Rol' : 'Extra'}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {readonly && (
        <p style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
          Los permisos del propietario no se pueden modificar.
        </p>
      )}
    </div>
  );
}
