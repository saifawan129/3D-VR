
import React from 'react';
import { ProductState } from '../types';
import { PRODUCT_CONFIGS } from '../constants';
import { Activity } from 'lucide-react';

interface UIOverlayProps {
  activeState: ProductState;
  onStateChange: (state: ProductState) => void;
  onRunDiagnostic: () => void;
  isScanning: boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ activeState, onStateChange, onRunDiagnostic, isScanning }) => {
  const current = PRODUCT_CONFIGS[activeState];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12 lg:p-16">
      
      {/* Top Navigation / Branding */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/40">Product Identification</div>
          <div className="text-xl md:text-2xl font-mono text-white/80">ID_{current.name.toUpperCase().replace(' ', '_')}</div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="text-3xl md:text-5xl font-black text-white">{current.price}</div>
          <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 mt-1">Free Global Shipping</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 lg:gap-12 items-end justify-between pointer-events-auto mt-auto">
        
        {/* Info Section */}
        <div className="flex-1 max-w-2xl text-white mb-8 md:mb-0">
          <div className="relative inline-block mb-4">
             <span className="text-xs uppercase tracking-[0.5em] text-white/50 font-bold mb-3 block transition-colors duration-500" style={{ color: current.color }}>
               {current.tagline}
             </span>
             <h2 key={activeState} className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none animate-slide-up">
               {current.name.split(' ')[0]}<br/>
               <span className="text-transparent stroke-text transition-all duration-500" style={{ WebkitTextStroke: `1px ${current.color}` }}>
                 {current.name.split(' ')[1] || 'SERIES'}
               </span>
             </h2>
          </div>
          <p className="text-sm md:text-base lg:text-lg opacity-60 leading-relaxed font-light mt-6 max-w-md border-l-2 border-white/10 pl-6 md:pl-8 backdrop-blur-sm py-4">
            {current.description}
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-opacity-80 transition-all active:scale-95 rounded-full shadow-2xl">
              Pre-Order Now
            </button>
            <button 
              onClick={onRunDiagnostic}
              disabled={isScanning}
              className={`flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all active:scale-95 rounded-full backdrop-blur-md ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Activity className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} style={{ color: current.color }} />
              {isScanning ? 'Analysing...' : 'Run Diagnostic'}
            </button>
          </div>
        </div>

        {/* Selection Grid */}
        <div className="grid grid-cols-1 gap-2 w-full md:w-[240px] lg:w-[280px]">
          {Object.entries(PRODUCT_CONFIGS).map(([key, config]) => {
            const isSelected = activeState === key;
            return (
              <button
                key={key}
                onClick={() => onStateChange(key as ProductState)}
                className={`
                  relative h-16 md:h-20 overflow-hidden group p-3 md:p-4 text-left transition-all duration-500
                  border backdrop-blur-xl rounded-xl
                  ${isSelected 
                    ? 'bg-white/10 border-white/30 scale-105 shadow-2xl' 
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'}
                `}
              >
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 ${isSelected ? 'h-full' : 'h-0'}`} 
                  style={{ backgroundColor: config.color }}
                />
                
                <div className="relative z-10 flex items-center gap-3 md:gap-4">
                  <div 
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors duration-500 ${isSelected ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: config.color }} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[8px] md:text-[9px] uppercase tracking-widest font-bold ${isSelected ? 'text-white' : 'text-white/30'}`}>
                      {key}
                    </span>
                    <div className="font-bold text-xs md:text-sm text-white uppercase tracking-tight">
                      {config.name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; filter: blur(10px); }
          to { transform: translateY(0); opacity: 1; filter: blur(0px); }
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stroke-text {
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default UIOverlay;
