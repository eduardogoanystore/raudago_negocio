import { getPlans } from '@/actions/subscription';
import { OnboardingPlanSelector } from '@/components/onboarding/OnboardingPlanSelector';

export const metadata = {
  title: 'Elige tu plan — RaudaGo',
};

export default async function RegistroPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const [plans, params] = await Promise.all([getPlans('BUSINESS'), searchParams]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F3EFE7',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '40px 24px 80px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: 760 }}>
        <OnboardingPlanSelector
          plans={plans}
          initialPlanKey={params.plan}
          initialInterval={params.interval as 'WEEK' | 'MONTH' | 'YEAR' | undefined}
        />
      </div>
    </main>
  );
}
