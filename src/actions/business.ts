'use server';

import { revalidatePath } from 'next/cache';
import { getServerClient } from '@/graphql/client';

/**
 * Actualiza los datos del *BusinessAccount* del usuario autenticado.
 * Campos disponibles según el schema del backend: first_name, last_name, phone.
 *
 * Los campos del Business en sí (name, email, address) no tienen mutation
 * disponible para el actor negocio_staff — deben gestionarse a través de soporte.
 */
const UPDATE_PROFILE = `
  mutation UpdateProfile($first_name: String, $last_name: String, $phone: String) {
    updateProfile(first_name: $first_name, last_name: $last_name, phone: $phone)
  }
`;

export interface UpdateProfileActionState {
  error?: string;
  success?: boolean;
}

export async function updateProfileAction(
  negocio_slug: string,
  _prevState: UpdateProfileActionState | null,
  formData: FormData,
): Promise<UpdateProfileActionState> {
  const first_name = (formData.get('first_name') as string)?.trim();
  const last_name = (formData.get('last_name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();

  if (!first_name) {
    return { error: 'El nombre es obligatorio.' };
  }
  if (!last_name) {
    return { error: 'El apellido es obligatorio.' };
  }

  let client;
  try {
    client = await getServerClient();
  } catch {
    return { error: 'Error al conectar con el servidor. Intenta de nuevo.' };
  }

  try {
    await client.request<{ updateProfile: unknown }>(UPDATE_PROFILE, {
      first_name,
      last_name,
      phone: phone || null,
    });
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const raw = gqlErr?.response?.errors?.[0]?.message ?? '';
    return { error: raw || 'No se pudo actualizar el perfil. Intenta de nuevo.' };
  }

  revalidatePath(`/negocio/${negocio_slug}/configuracion`);
  return { success: true };
}
