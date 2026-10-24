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
      description
      priceWeeklyCents
      priceMonthlyCents
      priceAnnualCents
      promoMonths
      promoPriceCents
      promoWeeks
      trialDays
      sortOrder
      features
      maxOrdersWeekly
      maxBranches
      maxMembers
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

// ─── Raw plan shape returned by the GraphQL endpoint ─────────────────────────

interface RawPlan {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceWeeklyCents: number;
  priceMonthlyCents: number;
  priceAnnualCents: number;
  promoMonths: number;
  promoPriceCents: number | null;
  promoWeeks: number | null;
  trialDays: number;
  sortOrder: number;
  features: string[] | null;
  maxOrdersWeekly: number | null;
  maxBranches: number | null;
  maxMembers: number | null;
}

// ─── Server Actions ───────────────────────────────────────────────────────────

export async function getPlans(
  subscriberType: 'BUSINESS' | 'DRIVER',
): Promise<SubscriptionPlan[]> {
  try {
    // Use raw fetch so Next.js can attach the Data Cache tag.
    // graphql-request abstracts fetch and does not expose next: {} options,
    // so we call fetch directly for this specific public query.
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: SUBSCRIPTION_PLANS_QUERY,
        variables: { subscriberType },
        operationName: 'subscriptionPlans',
      }),
      next: { tags: ['subscription_plans'], revalidate: false },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as {
      data?: { subscriptionPlans: RawPlan[] };
      errors?: { message: string }[];
    };
    if (json.errors?.length) throw new Error(json.errors[0].message);
    const plans = json.data?.subscriptionPlans ?? [];

    return plans.map((p) => ({
      id: p.id,
      key: p.key,
      name: p.name,
      description: p.description,
      price_weekly_cents: p.priceWeeklyCents,
      price_monthly_cents: p.priceMonthlyCents,
      price_annual_cents: p.priceAnnualCents,
      promo_months: p.promoMonths,
      promo_price_cents: p.promoPriceCents,
      promo_weeks: p.promoWeeks,
      trial_days: p.trialDays,
      sort_order: p.sortOrder,
      features: p.features,
      max_orders_weekly: p.maxOrdersWeekly,
      max_branches: p.maxBranches,
      max_members: p.maxMembers,
    }));
  } catch (e: unknown) {
    console.error('[getPlans] error:', e);
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
