'use server';

import { cookies } from 'next/headers';
import { GraphQLClient } from 'graphql-request';
import type { SubscriptionPlan, UserSubscription } from '@/lib/subscription';
import { MY_SUBSCRIPTION_QUERY } from '@/lib/subscription';
const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthClient(): Promise<GraphQLClient> {
  const cookieStore = await cookies();
  const token = cookieStore.get('businessToken')?.value ?? '';
  return new GraphQLClient(ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Queries / Mutations ──────────────────────────────────────────────────────

const SUBSCRIPTION_PLANS_QUERY = `
  query subscriptionPlans($subscriberType: SubscriberType!) {
    subscriptionPlans(subscriberType: $subscriberType) {
      id
      key
      name
      priceWeeklyCents
      priceMonthlyCents
      priceAnnualCents
      promoMonths
      promoPriceCents
      trialDays
      sortOrder
    }
  }
`;

const CREATE_CHECKOUT_MUTATION = `
  mutation createSubscriptionCheckout($planId: String!, $interval: BillingInterval!) {
    createSubscriptionCheckout(planId: $planId, interval: $interval) {
      checkoutUrl
    }
  }
`;

const CANCEL_SUBSCRIPTION_MUTATION = `
  mutation cancelSubscription {
    cancelSubscription
  }
`;

const RESUME_SUBSCRIPTION_MUTATION = `
  mutation resumeSubscription {
    resumeSubscription
  }
`;

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function getPlans(
  subscriberType: 'BUSINESS' | 'DRIVER',
): Promise<SubscriptionPlan[]> {
  try {
    const client = new GraphQLClient(ENDPOINT, {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
    });
    const data = await client.request<{
      subscriptionPlans: Array<{
        id: string;
        key: string;
        name: string;
        priceWeeklyCents: number;
        priceMonthlyCents: number;
        priceAnnualCents: number;
        promoMonths: number;
        promoPriceCents: number | null;
        trialDays: number;
        sortOrder: number;
      }>;
    }>(SUBSCRIPTION_PLANS_QUERY, { subscriberType });

    return data.subscriptionPlans.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      price_weekly_cents: p.priceWeeklyCents,
      price_monthly_cents: p.priceMonthlyCents,
      price_annual_cents: p.priceAnnualCents,
      promo_months: p.promoMonths,
      promo_price_cents: p.promoPriceCents,
      trial_days: p.trialDays,
      sort_order: p.sortOrder,
    }));
  } catch {
    return [];
  }
}

export async function getMySubscription(): Promise<UserSubscription | null> {
  try {
    const client = await getAuthClient();
    const data = await client.request<{
      mySubscription: {
        id: string;
        status: string;
        billingCycleType: string;
        currentPeriodEnd: string | null;
        cancelAtPeriodEnd: boolean;
        plan: { id: string; name: string };
      } | null;
    }>(MY_SUBSCRIPTION_QUERY);

    if (!data.mySubscription) return null;
    const s = data.mySubscription;
    return {
      id: s.id,
      status: s.status,
      billingCycleType: s.billingCycleType,
      currentPeriodEnd: s.currentPeriodEnd,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      subscription_plan: s.plan,
    };
  } catch {
    return null;
  }
}

export async function startSubscriptionCheckout(
  planId: string,
  interval: string,
): Promise<{ checkoutUrl: string } | { error: string }> {
  try {
    const client = await getAuthClient();
    const data = await client.request<{
      createSubscriptionCheckout: { checkoutUrl: string };
    }>(CREATE_CHECKOUT_MUTATION, { planId, interval });
    return { checkoutUrl: data.createSubscriptionCheckout.checkoutUrl };
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    const message =
      gqlErr?.response?.errors?.[0]?.message ?? 'Error al iniciar el checkout.';
    return { error: message };
  }
}

export async function cacheSubscriptionStatus(businessId: string, status: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`sub_status_${businessId}`, status, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });
}

export async function clearSubscriptionCache(businessId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(`sub_status_${businessId}`);
}

export async function cancelSubscriptionAction(): Promise<{ error?: string }> {
  try {
    const client = await getAuthClient();
    await client.request(CANCEL_SUBSCRIPTION_MUTATION);
    return {};
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    return {
      error:
        gqlErr?.response?.errors?.[0]?.message ?? 'Error al cancelar la suscripción.',
    };
  }
}

export async function reactivateSubscriptionAction(): Promise<{ error?: string }> {
  try {
    const client = await getAuthClient();
    await client.request(RESUME_SUBSCRIPTION_MUTATION);
    return {};
  } catch (err: unknown) {
    const gqlErr = err as { response?: { errors?: { message: string }[] } };
    return {
      error:
        gqlErr?.response?.errors?.[0]?.message ?? 'Error al reactivar la suscripción.',
    };
  }
}
