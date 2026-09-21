'use client';

import { useTransition } from 'react';
import { deactivateMemberAction, removeMemberAction } from '@/actions/employees';

interface Props {
  memberId: string;
  negocio_slug: string;
  action: 'deactivate' | 'remove';
}

export function DeactivateMemberButton({ memberId, negocio_slug, action }: Props) {
  const [isPending, startTransition] = useTransition();

  const isRemove = action === 'remove';
  const label = isRemove ? 'Eliminar empleado' : 'Desactivar empleado';
  const confirmMsg = isRemove
    ? '¿Eliminar a este empleado? Esta accion no se puede deshacer.'
    : '¿Desactivar a este empleado? Perdera acceso al portal.';

  function handleClick() {
    if (!window.confirm(confirmMsg)) return;
    startTransition(async () => {
      if (isRemove) {
        await removeMemberAction(memberId, negocio_slug);
      } else {
        await deactivateMemberAction(memberId, negocio_slug);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        padding: '0.6rem 1.25rem',
        background: 'var(--color-surface)',
        color: isRemove ? 'var(--color-alert)' : '#92400E',
        border: `1px solid ${isRemove ? 'var(--color-alert)' : '#D97706'}`,
        borderRadius: '0.5rem',
        fontWeight: 600,
        fontSize: '0.875rem',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {isPending ? 'Procesando...' : label}
    </button>
  );
}
