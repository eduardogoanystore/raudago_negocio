'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { publicClient } from '@/graphql/client';

const LOGIN_PIN = `
  mutation loginBusinessPIN($business_account_id: ID!, $pin: String!) {
    loginBusinessPIN(business_account_id: $business_account_id, pin: $pin) {
      token
      user
    }
  }
`;

export async function loginWithPIN(accountId: string, pin: string) {
  try {
    const data = await publicClient.request<{ loginBusinessPIN: { token: string } }>(LOGIN_PIN, {
      business_account_id: accountId,
      pin,
    });
    const cookieStore = await cookies();
    cookieStore.set('businessToken', data.loginBusinessPIN.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: '/',
    });
  } catch (err: any) {
    const message = err?.response?.errors?.[0]?.message ?? 'PIN incorrecto';
    return { error: message };
  }
  redirect('/negocio/');
}
