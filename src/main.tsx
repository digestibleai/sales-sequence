import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Redirect paths without hash to hash-based paths
const path = window.location.pathname;
const base = '/sales-sequence/';
// Strip the base path if present (base ends with '/', so we keep the leading '/' from the route)
const routePath = path.startsWith(base)
  ? path.slice(base.length - 1) // Slice from base.length - 1 to keep the leading slash
  : path;

if (routePath !== "/" && !window.location.hash) {
  window.location.replace(`/#${routePath}`);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
