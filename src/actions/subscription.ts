'use server';

import { cookies } from 'next/headers';
import { GraphQLClient } from 'graphql-request';

const ENDPOINT = process.env.GRAPHQL_ENDPOINT ?? 'http://localhost:8787';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string | null;
  price_weekly_cents: number;
  price_monthly_cents: number;
  price_annual_cents: number;
  promo_months: number;
  promo_price_cents: number | null;
  promo_interval?: string | null;
  features?: string[] | null;
  is_default?: boolean;
}

export interface UserSubscription {
  id: string;
  status: string;
  billingCycleType: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  subscription_plan: {
    id: string;
    name: string;
  };
}

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

const MY_SUBSCRIPTION_QUERY = `
  query mySubscription {
    mySubscription {
      id
      status
      billingCycleType
      currentPeriodEnd
      cancelAtPeriodEnd
      plan {
        id
        name
      }
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
      name: p.name,
      price_weekly_cents: p.priceWeeklyCents,
      price_monthly_cents: p.priceMonthlyCents,
      price_annual_cents: p.priceAnnualCents,
      promo_months: p.promoMonths,
      promo_price_cents: p.promoPriceCents,
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

export async function cacheSubscriptionStatus(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('businessToken')?.value ?? '';
    if (!token) return;

    const client = new GraphQLClient(ENDPOINT, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

    const sub = data.mySubscription;
    const payload = sub
      ? JSON.stringify({
          id: sub.id,
          status: sub.status,
          billingCycleType: sub.billingCycleType,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
          subscription_plan: sub.plan,
        })
      : '';

    cookieStore.set('subscriptionStatus', payload, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  } catch {
    // Non-fatal
  }
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
