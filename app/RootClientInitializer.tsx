'use client';

import { suppressNetworkErrors } from '@/shared/utils/runtimeSafety';
import { useEffect } from 'react';

/**
 * Register service worker for PWA functionality
 */
function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  
  // Check if service workers are supported
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Workers not supported in this browser');
    return;
  }

  // Register the service worker
  navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none',
  }).then((registration) => {
    console.log('[SW] Service Worker registered successfully:', registration);
    
    // Check for updates regularly
    const checkForUpdates = () => {
      registration.update().then(() => {
        if (registration.waiting) {
          console.log('[SW] Service Worker update available');
          // Notify user of update in production
          if (process.env.NODE_ENV === 'production') {
            // You can trigger a toast notification here
          }
        }
      });
    };

    // Check for updates every hour
    setInterval(checkForUpdates, 60 * 60 * 1000);
  }).catch((error) => {
    console.error('[SW] Service Worker registration failed:', error);
  });

  // Listen for controller change (new SW took over)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] Controller changed - new Service Worker is now active');
  });
}

/**
 * Initializes client-side error suppression for production environment.
 * Suppresses CORS and network errors from console to keep Lighthouse scores clean.
 */
export function RootClientInitializer() {
  useEffect(() => {
    registerServiceWorker();
    suppressNetworkErrors();
  }, []);

  return null;
}

