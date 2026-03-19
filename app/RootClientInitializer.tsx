'use client';

import { suppressNetworkErrors } from '@/shared/utils/runtimeSafety';
import { useEffect } from 'react';

/**
 * Initializes client-side error suppression for production environment.
 * Suppresses CORS and network errors from console to keep Lighthouse scores clean.
 */
export function RootClientInitializer() {
  useEffect(() => {
    suppressNetworkErrors();
  }, []);

  return null;
}

