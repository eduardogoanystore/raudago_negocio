'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { publicClient } from '@/graphql/client';
import { cacheSubscriptionStatus } from '@/actions/subscription';

const LOGIN_PIN = `
  mutation loginBusinessPIN($business_account_id: ID!, $pin: String!) {
    loginBusinessPIN(business_account_id: $business_account_id, pin: $pin) {
      token
      user
    }
  }
`;

export async function loginWithPIN(accountId: string, pin: string) {
  let slug: string | undefined;
  try {
    const data = await publicClient.request<{
      loginBusinessPIN: {
        token: string;
        user: { business_id?: string; business_slug?: string; subscription_status?: string };
      };
    }>(LOGIN_PIN, { business_account_id: accountId, pin });

    const { token, user } = data.loginBusinessPIN;
    const TTL = 24 * 60 * 60 * 1000;
    const cookieStore = await cookies();

    cookieStore.set('businessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + TTL),
      path: '/',
    });

    if (user?.business_id) {
      cookieStore.set('business_id', user.business_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + TTL),
        path: '/',
      });
    }

    // Cachear estado de suscripción para evitar queries en cada navegación
    if (user?.business_id && user?.subscription_status) {
      await cacheSubscriptionStatus(user.business_id, user.subscription_status);
    }

    slug = user?.business_slug;
  } catch (err: any) {
    const message = err?.response?.errors?.[0]?.message ?? 'PIN incorrecto';
    return { error: message };
  }

  redirect(slug ? `/${slug}/` : '/');
}
