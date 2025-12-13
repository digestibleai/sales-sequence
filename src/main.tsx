import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// Redirect paths without hash to hash-based paths
// Only redirect if we're not loading assets and there's no hash already
// const path = window.location.pathname;
// const base = '/sales-sequence/';

// // Check if this is an asset request (has file extension or contains /assets/)
// const isAssetRequest = path.includes('/assets/') ||
//   path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|map|webp|avif)$/i);

// // Don't redirect if:
// // 1. Already has a hash
// // 2. Path is just the base or root
// // 3. This is an asset request
// if (!window.location.hash && path !== '/' && path !== base && !isAssetRequest) {
//   // Strip the base path if present
//   const routePath = path.startsWith(base)
//     ? path.slice(base.length - 1) // Slice from base.length - 1 to keep the leading slash
//     : path;

//   // Only redirect if we have a valid route path
//   if (routePath !== "/" && routePath.startsWith('/')) {
//     window.location.replace(`/#${routePath}`);
//   }
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
