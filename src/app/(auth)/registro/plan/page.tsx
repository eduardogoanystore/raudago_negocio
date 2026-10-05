import { getPlans } from '@/actions/subscription';
import { getServerClient } from '@/graphql/client';
import { OnboardingPlanSelector } from '@/components/onboarding/OnboardingPlanSelector';

export const metadata = {
  title: 'Elige tu plan — RaudaGo',
};

const MY_BUSINESS_NAME_QUERY = `
  query myBusiness {
    myBusiness {
      name
    }
  }
`;

export default async function RegistroPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const [plans, params] = await Promise.all([getPlans('BUSINESS'), searchParams]);

  let businessName: string | undefined;
  try {
    const client = await getServerClient();
    const data = await client.request<{ myBusiness: { name: string } | null }>(
      MY_BUSINESS_NAME_QUERY,
    );
    businessName = data.myBusiness?.name ?? undefined;
  } catch {
    // Non-fatal
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F3EFE7' }}>
      <OnboardingPlanSelector
        plans={plans}
        initialPlanKey={params.plan}
        initialInterval={params.interval as 'WEEK' | 'MONTH' | 'YEAR' | undefined}
        businessName={businessName}
      />
    </main>
  );
}
