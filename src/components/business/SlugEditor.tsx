'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateBusinessSlugAction } from '@/actions/business';

const INPUT_STYLE: React.CSSProperties = {
  height: 44,
  borderRadius: 10,
  border: '1.5px solid #DED7C9',
  background: '#FFFDFA',
  padding: '0 16px',
  fontSize: 15,
  color: '#121214',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
};

export default function SlugEditor({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const [slug, setSlug] = useState(currentSlug);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasChanged = slug !== currentSlug && slug.length >= 3;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(val);
    setError(null);
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateBusinessSlugAction(currentSlug, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.slug) {
        setSuccess(true);
        // Navigate to new slug URL
        router.replace(`/${result.slug}/configuracion`);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#121214' }}>
          URL del portal
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            background: '#F3EFE7',
            border: '1.5px solid #DED7C9',
            borderRight: 'none',
            borderRadius: '10px 0 0 10px',
            fontSize: 14,
            color: '#8E8B93',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            negocio.raudago.com/
          </span>
          <input
            name="slug"
            value={slug}
            onChange={handleChange}
            style={{
              ...INPUT_STYLE,
              borderRadius: '0 10px 10px 0',
            }}
            maxLength={60}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <span style={{ fontSize: 12, color: '#8E8B93' }}>
          Solo letras minúsculas, números y guiones. Ej: <code>sushi-kazan</code>
        </span>
      </div>

      {error && (
        <div style={{
          background: '#FFF0F0',
          border: '1px solid #FFCDD2',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#B00020',
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#065F46',
        }}>
          URL actualizada correctamente.
        </div>
      )}

      {hasChanged && (
        <button
          type="submit"
          disabled={isPending}
          style={{
            alignSelf: 'flex-start',
            height: 40,
            padding: '0 20px',
            borderRadius: 10,
            background: isPending ? '#A08EFF' : '#6C47FF',
            border: 'none',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isPending ? 'Guardando...' : 'Guardar URL'}
        </button>
      )}
    </form>
  );
}
