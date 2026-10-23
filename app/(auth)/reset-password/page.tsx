import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordPage';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
      </div>
    }>
      <ResetPasswordPage />
    </Suspense>
  );
}