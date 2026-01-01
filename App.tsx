
import React, { useState, Suspense } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import Loader from './components/Loader';
import AIDiagnosticHUD from './components/AIDiagnosticHUD';
import { ProductState } from './types';
import { PRODUCT_CONFIGS } from './constants';
import { generateProductDiagnostic, ProductDiagnostic } from './services/ai';

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<ProductState>(ProductState.GLASSES);
  const [diagnosticData, setDiagnosticData] = useState<ProductDiagnostic | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunDiagnostic = async () => {
    setIsScanning(true);
    setDiagnosticData(null);
    const config = PRODUCT_CONFIGS[activeState];
    const data = await generateProductDiagnostic(config.name, config.tagline);
    setDiagnosticData(data);
    setIsScanning(false);
  };

  const currentConfig = PRODUCT_CONFIGS[activeState];

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden select-none">
      
      <Suspense fallback={<Loader />}>
        {/* 3D Scene Container */}
        <div className="absolute inset-0 z-0">
          <Scene activeState={activeState} isScanning={isScanning} />
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

        {/* AI HUD Overlay */}
        <AIDiagnosticHUD 
          data={diagnosticData} 
          loading={isScanning} 
          accentColor={currentConfig.color} 
        />

        {/* Interactive UI Overlay */}
        <UIOverlay 
          activeState={activeState} 
          onStateChange={(state) => {
            setActiveState(state);
            setDiagnosticData(null); // Clear diagnostic on change
          }} 
          onRunDiagnostic={handleRunDiagnostic}
          isScanning={isScanning}
        />

        {/* Dynamic Global Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
      </Suspense>

      <div className="absolute inset-0 z-[-1] bg-[#050505]" />
    </div>
  );
};

export default App;
