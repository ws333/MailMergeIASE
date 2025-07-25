import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './components/Root';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
