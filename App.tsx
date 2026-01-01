
import React, { useState, Suspense } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import Loader from './components/Loader';
import { ProductState } from './types';

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<ProductState>(ProductState.GLASSES);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      
      {/* Cinematic Loader for Initial Assets */}
      <Suspense fallback={<Loader />}>
        {/* 3D Scene Container */}
        <div className="absolute inset-0 z-0">
          <Scene activeState={activeState} />
        </div>

        {/* Header Branding */}
        <div className="absolute top-8 left-8 z-10 text-white pointer-events-none">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-[2px] bg-white/30" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/50">Next-Gen Collection</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            AESTHETIC<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              SHOWROOM
            </span>
          </h1>
        </div>

        {/* Interactive UI Overlay */}
        <UIOverlay 
          activeState={activeState} 
          onStateChange={setActiveState} 
        />

        {/* Dynamic Global Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
      </Suspense>

      {/* Background Ambience Mask */}
      <div className="absolute inset-0 z-[-1] bg-[#050505]" />
    </div>
  );
};

export default App;
