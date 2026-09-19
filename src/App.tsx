import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
