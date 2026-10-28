export interface SubscriptionPlan {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  price_weekly_cents: number;
  price_monthly_cents: number;
  price_annual_cents: number;
  promo_weeks: number;
  promo_price_cents: number | null;
  trial_days: number;
  sort_order: number;
  features?: string[] | null;
  max_orders_weekly?: number | null;
  max_branches?: number | null;
  max_members?: number | null;
  is_default?: boolean;
}

export interface UserSubscription {
  id: string;
  status: string;
  billingCycleType: string;
  currentPeriodStart: string | null;
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
      currentPeriodStart
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
