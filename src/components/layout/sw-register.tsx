'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/sw-register';

/**
 * Headless component that triggers service worker registration on mount.
 * Renders nothing — exists solely for the useEffect side-effect.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
