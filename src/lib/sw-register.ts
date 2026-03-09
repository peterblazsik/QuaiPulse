/**
 * Service worker registration utility.
 * Registers /sw.js in all environments (including dev for testing),
 * with appropriate logging to distinguish environments.
 */
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported in this browser.');
    return;
  }

  const isDev = window.location.hostname === 'localhost';

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    if (isDev) {
      console.log('[SW] Registered in development mode:', registration.scope);
    }

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'activated' &&
          navigator.serviceWorker.controller
        ) {
          // A new version of the SW activated while the user has the page open.
          // In a future iteration this could trigger a toast prompting a reload.
          console.log('[SW] New version activated. Refresh for latest.');
        }
      });
    });
  } catch (error) {
    console.error('[SW] Registration failed:', error);
  }
}
