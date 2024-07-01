import { Suspense, FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Wait } from '@shared/index';

import './app.css';

// Pages
import Home from '@pages/home';

const App: FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<Wait />}>
          <Routes>
            <Route key="001" path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
