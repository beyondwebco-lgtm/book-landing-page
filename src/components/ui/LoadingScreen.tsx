import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 4;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#090806] flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Central Diya Point of Light Expanding */}
      <div className="relative mb-10">
        <div className="w-16 h-16 rounded-full bg-[#E5A93C] blur-xl opacity-60 animate-ping" />
        <div className="w-8 h-8 rounded-full bg-[#FFDF78] border border-[#FFE89E] shadow-[0_0_25px_#FFDF78] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-3 mb-10">
        <span className="text-[11px] font-cinzel text-antique-gold tracking-[0.3em] uppercase block">
          ॥ तीर्थ यात्रा महात्म्यम् ॥
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-widest text-warm-ivory">
          THIRTHA YATRA
        </h1>
        <p className="font-cinzel text-sm sm:text-base text-antique-gold/80 tracking-widest uppercase">
          Temples & Kshetras
        </p>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="w-64 max-w-xs space-y-2">
        <div className="h-0.5 bg-antique-gold/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-burnished-gold via-antique-gold to-[#FFE28A] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-cinzel text-old-paper/50">
          <span>Sanctum Chamber</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
