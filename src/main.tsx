import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer';

// Polyfill Buffer and process for simple-peer
globalThis.Buffer = globalThis.Buffer || Buffer;
if (typeof globalThis.process === 'undefined') {
  (globalThis as any).process = { env: {} };
}
(globalThis as any).process.nextTick = (globalThis as any).process.nextTick || ((cb: Function) => setTimeout(cb, 0));

import './index.css'
import App from './App.tsx'

import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
