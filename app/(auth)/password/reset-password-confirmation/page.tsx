import ResetPasswordConfirmation from '@/components/ResetPasswordConfirmation';
import React, { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordConfirmation />
    </Suspense>
  );
}