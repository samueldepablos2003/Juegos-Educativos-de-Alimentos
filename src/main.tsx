import { createRoot } from 'react-dom/client';
import '@fontsource/fredoka/600.css';
import '@fontsource/fredoka/700.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';
import { startBackgroundAssetPreload } from './utils/imagePreloader';

// Register the offline Service Worker silently in the background (no UI prompt)
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

startBackgroundAssetPreload();

createRoot(document.getElementById('root')!).render(<App />);
