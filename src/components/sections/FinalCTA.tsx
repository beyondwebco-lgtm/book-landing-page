import React from 'react';
import { BOOK_METADATA } from '../../lib/bookData';
import { soundEngine } from '../../lib/soundEngine';
import { ShoppingCart, RotateCcw, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const handleExploreAgain = () => {
    soundEngine.playPageTurn();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-32 px-4 sm:px-8 bg-gradient-to-b from-[#0A0806] via-[#15120F] to-[#0A0806] text-warm-ivory text-center overflow-hidden">
      {/* Background Radiance Glow (Diya Amber Light Pool) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#E5A83B]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-antique-gold/30 bg-[#211A14]/80 text-antique-gold text-[10px] uppercase font-cinzel tracking-[0.2em] font-semibold mb-6 shadow-md">
          <Sparkles className="w-3 h-3 text-antique-gold" />
          <span>The Sanctum Sanctorum • Mandapa VI</span>
        </div>

        <h2 className="font-garamond text-4xl sm:text-6xl font-semibold tracking-tight text-warm-ivory mb-5 leading-tight">
          The Journey Begins<br />
          <span className="text-antique-gold italic">with a single page.</span>
        </h2>

        <p className="font-garamond text-lg sm:text-2xl text-aged-parchment italic max-w-2xl mx-auto mb-10 leading-relaxed">
          “Keep the timeless wisdom, mantras, and sanctum routes of India’s most sacred kshetras in your hands.”
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playTempleBell()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#C9A45C] hover:bg-[#D4AF37] text-[#0A0806] font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] shadow-[0_4px_24px_rgba(201,164,92,0.35)], inset 0 1px 0 rgba(255,255,255,0.25)"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy The Book on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            onClick={handleExploreAgain}
            className="w-full sm:w-auto px-6 py-3.5 rounded-md border border-antique-gold/30 hover:border-antique-gold bg-[#15120F] hover:bg-antique-gold/10 text-warm-ivory font-sans text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 backdrop-blur-sm shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-antique-gold" />
            <span>Return to Temple Sanctum</span>
          </button>
        </div>

        {/* Amazon Assurance Footnote */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-aged-parchment/70 font-sans border-t border-antique-gold/15 pt-8 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-antique-gold" />
            <span>Official Amazon Fulfillment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>•</span>
            <span>Paperback & Hardcover Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>•</span>
            <span>Fast Pan-India Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};
