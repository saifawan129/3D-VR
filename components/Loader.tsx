
import React from 'react';
import { useProgress } from '@react-three/drei';

const Loader: React.FC = () => {
  const { progress } = useProgress();
  
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-1000">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Animated Rings */}
        <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
        <div 
          className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" 
          style={{ animationDuration: '2s' }}
        />
        <div 
          className="absolute inset-4 border border-white/10 rounded-full animate-reverse-spin" 
          style={{ animationDuration: '3s' }}
        />
        
        <div className="flex flex-col items-center">
          <span className="text-4xl font-black tracking-tighter text-white">
            {Math.round(progress)}%
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30 mt-2">
            Initializing Engine
          </span>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 animate-pulse">
          Calibrating Spatial Environment
        </p>
      </div>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
