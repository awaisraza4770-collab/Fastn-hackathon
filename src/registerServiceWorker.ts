import { registerSW } from 'virtual:pwa-register';

export function initPWA() {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('New version of Expense Coach is available. Update now?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('Expense Coach is ready for offline Android and Web usage.');
      },
    });
  }
}
