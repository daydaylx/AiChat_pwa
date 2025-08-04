import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
