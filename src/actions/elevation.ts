'use server';

import { getServerClient } from '@/graphql/client';

const ELEVATE_WITH_PIN = `
  mutation elevateWithPIN($pin: String!, $action: String!) {
    elevateWithPIN(pin: $pin, action: $action)
  }
`;

export async function elevateWithPINAction(
  pin: string,
  action: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await getServerClient();
    await client.request(ELEVATE_WITH_PIN, { pin, action });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.response?.errors?.[0]?.message ?? 'PIN incorrecto' };
  }
}
