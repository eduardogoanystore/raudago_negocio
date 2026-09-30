import { Suspense } from 'react';
import { NIPLoginForm } from '@/components/auth/NIPLoginForm';

export default function LoginNIPPage() {
  return (
    <Suspense fallback={null}>
      <NIPLoginForm />
    </Suspense>
  );
}
