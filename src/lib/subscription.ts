export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  price_weekly_cents: number;
  price_monthly_cents: number;
  price_annual_cents: number;
  promo_months: number;
  promo_price_cents: number | null;
  promo_interval?: string | null;
  trial_days: number;
  sort_order: number;
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

export const MY_SUBSCRIPTION_QUERY = `
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

export const ACTIVE_STATUSES = ['ACTIVE', 'TRIALING'];
