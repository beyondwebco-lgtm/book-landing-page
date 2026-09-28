import React from 'react';
import { BOOK_METADATA } from '../../lib/bookData';
import { ShoppingBag, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0806] border-t border-antique-gold/20 py-12 px-6 sm:px-12 text-warm-ivory">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h4 className="font-garamond text-xl font-bold text-warm-ivory tracking-wide">
            Thirtha Yatra Guide
          </h4>
          <p className="font-garamond text-sm text-antique-gold italic mt-0.5">
            Temples & Kshetras — by {BOOK_METADATA.author}
          </p>
          <p className="text-[11px] text-aged-parchment/50 font-sans mt-2">
            © {new Date().getFullYear()} Ramesh Gangashetty. All sacred rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-md bg-[#211A14] hover:bg-[#C9A45C] border border-antique-gold/35 text-antique-gold hover:text-[#0A0806] font-sans text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-all duration-200 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order on Amazon</span>
          </a>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-md border border-antique-gold/25 hover:border-antique-gold text-antique-gold hover:bg-[#211A14] transition-all duration-200"
            title="Return to Sanctum"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
