import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import './index.css'
import App from './App.jsx'
import 'flag-icons/css/flag-icons.min.css'
import './in18n';
import { SiteProvider } from './context/SiteContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <SiteProvider>
        <App />
      </SiteProvider>
    </HelmetProvider>
  </StrictMode>,
)
