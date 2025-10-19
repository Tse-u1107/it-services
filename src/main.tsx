import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { loadLocale } from './i18n/i18n-util.sync';

// ensure translations are loaded synchronously before rendering
loadLocale('en');
loadLocale('zh');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
