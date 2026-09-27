import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameSimulatorProps {
  children: React.ReactNode;
  isActive: boolean;
}

export const MobileFrameSimulator: React.FC<MobileFrameSimulatorProps> = ({
  children,
  isActive
}) => {
  if (!isActive) {
    return <div className="min-h-screen bg-[#08090d] text-zinc-100 flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#06070a] py-6 px-4 flex flex-col items-center justify-center">
      {/* Apple iPhone Sleek Outer Titanium Shell */}
      <div className="w-full max-w-[420px] h-[860px] max-h-[94vh] rounded-[52px] bg-zinc-950 border-[9px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative ring-1 ring-white/10">
        
        {/* Dynamic Island / Status Bar */}
        <div className="bg-zinc-950 px-7 pt-3 pb-2 flex items-center justify-between text-zinc-400 text-[11px] select-none border-b border-white/[0.04] shrink-0 z-50">
          <span className="font-semibold text-zinc-200">9:41</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 bg-black rounded-full border border-zinc-800/80 flex items-center justify-between px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Inner Phone Viewport */}
        <div className="flex-1 overflow-y-auto bg-[#08090d] text-zinc-100 flex flex-col">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="bg-zinc-950 py-2 flex justify-center shrink-0 border-t border-white/[0.04]">
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
