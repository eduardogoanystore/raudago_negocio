import { GraphQLClient } from 'graphql-request';
import { cookies } from 'next/headers';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

/**
 * Cliente para Server Actions y Server Components.
 * Lee businessToken y business_id de cookies automáticamente.
 * Se puede sobreescribir businessId para casos especiales.
 */
export async function getServerClient(businessId?: string): Promise<GraphQLClient> {
  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value ?? '';
  const resolvedBusinessId = businessId ?? cookieStore.get('business_id')?.value ?? '';

  return new GraphQLClient(ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(resolvedBusinessId ? { 'x-business-id': resolvedBusinessId } : {}),
    },
  });
}

/**
 * Cliente público para operaciones sin auth (ej: tariffTiers en registro)
 */
export const publicClient = new GraphQLClient(ENDPOINT, {
  fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
});
