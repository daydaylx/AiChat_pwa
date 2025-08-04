import React, { useEffect } from 'react';
import { MainLayout } from './MainLayout';
import { ToastContainer } from './ui/ToastContainer';
import { AppProviders } from '../context/index';

/**
 * Root App component
 * Sets up providers, initializes PWA features, and renders the main layout
 */
const App: React.FC = () => {
  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful');
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <AppProviders>
      <div className="app">
        <MainLayout />
        <ToastContainer />
      </div>
    </AppProviders>
  );
};

export default App;
