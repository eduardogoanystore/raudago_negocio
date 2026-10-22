'use server';

import { revalidatePath } from 'next/cache';
import { getServerClient } from '@/graphql/client';

const CREATE_UPLOAD_URL = `
  mutation CreateBusinessUploadUrl($field: String!) {
    createBusinessUploadUrl(field: $field) {
      uploadUrl
      path
    }
  }
`;

const UPDATE_BUSINESS_MEDIA = `
  mutation UpdateBusinessMedia($input: UpdateBusinessInput!) {
    updateBusiness(input: $input) {
      id
      logo_url
      cover_url
    }
  }
`;

export type CreateUploadUrlActionResult =
  | { ok: true; uploadUrl: string; path: string }
  | { ok: false; error: string };

export async function createBusinessUploadUrlAction(
  field: 'logo' | 'cover',
): Promise<CreateUploadUrlActionResult> {
  let client;
  try {
    client = await getServerClient();
  } catch {
    return { ok: false, error: 'Error al conectar con el servidor. Intenta de nuevo.' };
  }

  try {
    const data = await client.request<{
      createBusinessUploadUrl: { uploadUrl: string; path: string };
    }>(CREATE_UPLOAD_URL, { field });
    return {
      ok: true,
      uploadUrl: data.createBusinessUploadUrl.uploadUrl,
      path: data.createBusinessUploadUrl.path,
    };
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const msg = gqlErr?.response?.errors?.[0]?.message ?? '';
    return { ok: false, error: msg || 'No se pudo obtener la URL de subida. Intenta de nuevo.' };
  }
}

export type UpdateBusinessMediaActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateBusinessMediaAction(
  negocio_slug: string,
  field: 'logo' | 'cover',
  path: string,
): Promise<UpdateBusinessMediaActionResult> {
  const input = field === 'logo' ? { logo_url: path } : { cover_url: path };

  let client;
  try {
    client = await getServerClient();
  } catch {
    return { ok: false, error: 'Error al conectar con el servidor. Intenta de nuevo.' };
  }

  try {
    await client.request<{ updateBusiness: { id: string } }>(UPDATE_BUSINESS_MEDIA, { input });
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const msg = gqlErr?.response?.errors?.[0]?.message ?? '';
    return { ok: false, error: msg || 'No se pudo guardar la imagen. Intenta de nuevo.' };
  }

  revalidatePath(`/${negocio_slug}/configuracion`);
  return { ok: true };
}
