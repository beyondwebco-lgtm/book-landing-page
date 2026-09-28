import React from 'react';
import { BOOK_METADATA } from '../../lib/bookData';
import { User, Feather, Heart, Sparkles, BookOpen } from 'lucide-react';

export const AuthorSection: React.FC = () => {
  return (
    <section id="author-section" className="relative py-28 px-4 sm:px-8 max-w-6xl mx-auto text-warm-ivory">
      {/* Background Sacred Geometric Mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square rounded-full border border-antique-gold/10 opacity-[0.15] pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-antique-gold/30 bg-[#211A14]/80 text-antique-gold text-[10px] uppercase font-cinzel tracking-[0.2em] font-semibold mb-3 shadow-md">
          <Feather className="w-3 h-3 text-antique-gold" />
          <span>The Scholar & Devotee • Mandapa V</span>
        </div>
        <h2 className="font-garamond text-3xl sm:text-5xl font-semibold text-warm-ivory mb-3 leading-tight">
          Meet The Author
        </h2>
        <p className="font-garamond text-base sm:text-lg text-aged-parchment italic">
          “A lifetime of devotion, field exploration, and reverent documentation distilled into a sacred guide.”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center bg-[#15120F] border border-antique-gold/25 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Left 5 cols: Respectful Author Portrait Presentation */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative group">
            {/* Subtle warm amber diya aura ring */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#E5A83B]/30 via-[#7A542B]/30 to-[#351711]/20 rounded-xl opacity-60 blur-sm group-hover:opacity-85 transition-opacity" />
            
            {/* Portrait Frame (Carved Stone Pillar Style) */}
            <div className="relative w-64 h-80 sm:w-72 sm:h-92 rounded-xl bg-[#1D1712] border border-antique-gold/35 flex flex-col items-center justify-center p-6 text-center shadow-2xl overflow-hidden">
              <div className="w-20 h-20 rounded-md bg-[#2B1F16] border border-antique-gold/30 flex items-center justify-center mb-5 shadow-inner">
                <User className="w-10 h-10 text-antique-gold" />
              </div>
              <h3 className="font-garamond text-2xl font-bold text-warm-ivory mb-1">
                {BOOK_METADATA.author}
              </h3>
              <p className="font-garamond text-sm text-antique-gold italic mb-3">
                Author & Sacred Heritage Chronicler
              </p>
              <div className="w-12 h-px bg-antique-gold/30 my-2" />
              <p className="text-[10px] font-cinzel text-aged-parchment/70 uppercase tracking-[0.18em]">
                Thirtha Yatra Guide
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 cols: Author Story & Respectful Editorial Bio */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] font-cinzel text-antique-gold uppercase tracking-[0.2em] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span>Devotion Through Literature</span>
          </div>

          <h3 className="font-garamond text-2xl sm:text-4xl font-semibold text-warm-ivory leading-tight">
            Preserving India&apos;s Pilgrimage Legacy
          </h3>

          <div className="space-y-4 font-garamond text-base sm:text-lg text-aged-parchment leading-relaxed">
            <p>
              With deep reverence for the sacred spiritual traditions of India, <strong className="text-warm-ivory font-semibold">Ramesh Gangashetty</strong> authored the <em className="text-warm-ivory">Thirtha Yatra Guide – Temples & Kshetras</em> to serve as an authentic, practical, and inspiring companion for pilgrims across generations.
            </p>
            <p>
              Rather than presenting dry itineraries, the work brings alive the sanctity, sthala puranas (temple histories), sacred theerthams, and proper ritual traditions observed across key northern, southern, and coastal Dhams.
            </p>
          </div>

          {/* Core Values / Pillar Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-antique-gold/15">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-[#211A14] border border-antique-gold/25 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Heart className="w-4 h-4 text-antique-gold" />
              </div>
              <div>
                <h4 className="font-garamond text-base font-semibold text-warm-ivory">Devotional Authenticity</h4>
                <p className="font-garamond text-sm text-aged-parchment/75">Verified traditions and sthala puranas.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-[#211A14] border border-antique-gold/25 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <BookOpen className="w-4 h-4 text-antique-gold" />
              </div>
              <div>
                <h4 className="font-garamond text-base font-semibold text-warm-ivory">Pilgrim Guidance</h4>
                <p className="font-garamond text-sm text-aged-parchment/75">Practical parikrama & theertham protocols.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
