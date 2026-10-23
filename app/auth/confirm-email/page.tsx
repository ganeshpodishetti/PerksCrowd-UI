import { Suspense } from 'react';
import ConfirmEmailPage from './ConfirmEmailPage';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
      </div>
    }>
      <ConfirmEmailPage />
    </Suspense>
  );
}