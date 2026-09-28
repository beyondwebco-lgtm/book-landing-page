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
    <section className="relative py-32 px-4 sm:px-8 bg-gradient-to-b from-deep-obsidian via-temple-black to-black text-warm-ivory text-center overflow-hidden">
      {/* Background Radiance Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-antique-gold/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-antique-gold/30 bg-antique-gold/10 text-antique-gold text-xs uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
          <span>Begin Your Sacred Pilgrimage</span>
        </div>

        <h2 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-tight text-warm-ivory mb-6 leading-tight">
          THE JOURNEY BEGINS<br />
          <span className="text-antique-gold">WITH A SINGLE PAGE.</span>
        </h2>

        <p className="font-garamond text-lg sm:text-2xl text-old-paper/85 italic max-w-2xl mx-auto mb-12 leading-relaxed">
          “Keep the timeless wisdom, mantras, and sanctum routes of India’s most sacred kshetras in your hands.”
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-14">
          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playTempleBell()}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-antique-gold hover:bg-[#D4AF37] text-deep-obsidian font-cinzel text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-[0_0_35px_rgba(201,164,92,0.4)]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy The Book on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleExploreAgain}
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-antique-gold/40 hover:border-antique-gold bg-temple-black/70 hover:bg-antique-gold/15 text-antique-gold font-cinzel text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Explore The Journey Again</span>
          </button>
        </div>

        {/* Amazon Assurance Footnote */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-old-paper/60 font-sans border-t border-antique-gold/15 pt-8 max-w-xl mx-auto">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-antique-gold/80" />
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
