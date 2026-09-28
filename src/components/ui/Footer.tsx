import React from 'react';
import { BOOK_METADATA } from '../../lib/bookData';
import { ShoppingBag, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-deep-obsidian border-t border-antique-gold/20 py-12 px-6 sm:px-12 text-warm-ivory">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h4 className="font-cinzel text-lg font-bold text-warm-ivory tracking-wider">
            THIRTHA YATRA GUIDE
          </h4>
          <p className="font-garamond text-xs text-antique-gold/90 italic">
            Temples & Kshetras — by {BOOK_METADATA.author}
          </p>
          <p className="text-[11px] text-old-paper/40 font-sans mt-2">
            © {new Date().getFullYear()} Ramesh Gangashetty. All sacred rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-antique-gold/15 hover:bg-antique-gold border border-antique-gold/40 text-antique-gold hover:text-deep-obsidian font-cinzel text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order on Amazon</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-antique-gold/30 hover:border-antique-gold text-antique-gold hover:bg-antique-gold/10 transition-colors"
            title="Return to Sanctum"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
