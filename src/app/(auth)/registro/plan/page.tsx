import { getPlans } from '@/actions/subscription';
import { OnboardingPlanSelector } from '@/components/onboarding/OnboardingPlanSelector';

export const metadata = {
  title: 'Elige tu plan — RaudaGo',
};

export default async function RegistroPlanPage() {
  const plans = await getPlans('BUSINESS');

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
      <div
        style={{
          width: '100%',
          maxWidth: 760,
        }}
      >
        <OnboardingPlanSelector plans={plans} />
      </div>
    </main>
  );
}
