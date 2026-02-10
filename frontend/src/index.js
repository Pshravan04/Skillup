import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './styles.css';

import ErrorBoundary from './components/ErrorBoundary';

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
