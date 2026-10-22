'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getOptimizedMediaUrls } from '@/lib/media';
import {
  createBusinessUploadUrlAction,
  updateBusinessMediaAction,
} from '@/actions/media';

interface Props {
  field: 'logo' | 'cover';
  currentPath: string | null;
  negocio_slug: string;
  label: string;
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

export default function BusinessMediaUploader({
  field,
  currentPath,
  negocio_slug,
  label,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isLogo = field === 'logo';

  const currentUrl = currentPath
    ? (() => {
        const result = getOptimizedMediaUrls(currentPath);
        return result.type === 'image' ? result.medium : null;
      })()
    : null;

  function handleButtonClick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      // 1. Get a signed upload URL from the backend
      const urlResult = await createBusinessUploadUrlAction(field);
      if (!urlResult.ok) {
        setError(urlResult.error);
        return;
      }

      const { uploadUrl, path } = urlResult;

      // 2. PUT the file directly to GCS
      let putResponse: Response;
      try {
        putResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: file,
        });
      } catch {
        setError('Error de red al subir la imagen. Verifica tu conexión e intenta de nuevo.');
        return;
      }

      if (!putResponse.ok) {
        setError('La subida falló. Intenta de nuevo.');
        return;
      }

      // 3. Persist the path via Server Action
      const saveResult = await updateBusinessMediaAction(negocio_slug, field, path);
      if (!saveResult.ok) {
        setError(saveResult.error);
        return;
      }

      setSuccess(true);
      router.refresh();
    });

    // Reset the input so the same file can be re-selected if needed
    e.target.value = '';
  }

  const previewStyle: React.CSSProperties = isLogo
    ? {
        width: 120,
        height: 120,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid var(--color-border)',
        display: 'block',
      }
    : {
        width: '100%',
        maxWidth: 480,
        height: 160,
        borderRadius: '0.75rem',
        objectFit: 'cover',
        border: '1px solid var(--color-border)',
        display: 'block',
      };

  const placeholderStyle: React.CSSProperties = isLogo
    ? {
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: '#F3EFE7',
        border: '1px dashed #DED7C9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-muted)',
        fontSize: '0.75rem',
        textAlign: 'center',
        flexShrink: 0,
      }
    : {
        width: '100%',
        maxWidth: 480,
        height: 160,
        borderRadius: '0.75rem',
        background: '#F3EFE7',
        border: '1px dashed #DED7C9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-muted)',
        fontSize: '0.85rem',
      };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label style={{
        display: 'block',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {label}
      </label>

      {/* Preview or placeholder */}
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt={label}
          style={previewStyle}
        />
      ) : (
        <div style={placeholderStyle}>
          {isLogo ? 'Sin logo' : 'Sin imagen de portada'}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={isPending}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
        style={{
          alignSelf: 'flex-start',
          height: 36,
          padding: '0 16px',
          borderRadius: 8,
          background: isPending ? 'var(--color-muted)' : 'var(--color-primary)',
          border: 'none',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          fontFamily: 'inherit',
          transition: 'opacity 0.15s',
        }}
      >
        {isPending
          ? 'Subiendo...'
          : currentUrl
            ? isLogo ? 'Cambiar logo' : 'Cambiar portada'
            : isLogo ? 'Subir logo' : 'Subir portada'}
      </button>

      {/* Feedback messages */}
      {error && (
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          color: 'var(--color-alert)',
          background: '#FEF2F2',
          border: '1px solid var(--color-alert)',
          borderRadius: '0.4rem',
          padding: '0.5rem 0.75rem',
        }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{
          margin: 0,
          fontSize: '0.8rem',
          color: '#065F46',
          background: '#D1FAE5',
          border: '1px solid #10B981',
          borderRadius: '0.4rem',
          padding: '0.5rem 0.75rem',
        }}>
          Imagen actualizada correctamente.
        </p>
      )}
    </div>
  );
}
