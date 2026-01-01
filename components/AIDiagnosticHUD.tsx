
import React from 'react';
import { ProductDiagnostic } from '../services/ai';

interface AIDiagnosticHUDProps {
  data: ProductDiagnostic | null;
  loading: boolean;
  accentColor: string;
}

const AIDiagnosticHUD: React.FC<AIDiagnosticHUDProps> = ({ data, loading, accentColor }) => {
  if (!data && !loading) return null;

  return (
    <div className="fixed top-32 right-8 z-30 w-64 pointer-events-none">
      <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-4 rounded-lg overflow-hidden relative">
        {/* Scanning Line Animation */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scan pointer-events-none" />
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Diagnostic HUD</span>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
        </div>

        {loading ? (
          <div className="space-y-4 py-4">
            <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
          </div>
        ) : data && (
          <div className="font-mono space-y-4">
            {data.specs.map((spec, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[9px] uppercase text-white/30">{spec.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white tracking-tighter">{spec.value}</span>
                  <span className="text-[10px] text-white/50">{spec.unit}</span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-white/40">INTEGRITY</span>
                <span style={{ color: accentColor }}>{data.integrityScore}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ width: `${data.integrityScore}%`, backgroundColor: accentColor }} 
                />
              </div>
            </div>

            <p className="text-[10px] leading-tight text-white/60 italic">
              {data.statusMessage}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AIDiagnosticHUD;
