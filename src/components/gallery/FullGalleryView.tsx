import React, { useState, useMemo } from 'react';
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryCategory } from '../../lib/galleryData';
import { GalleryLightbox } from './GalleryLightbox';
import { soundEngine } from '../../lib/soundEngine';
import { BOOK_METADATA } from '../../lib/bookData';
import { ArrowLeft, MapPin, Maximize2, ShoppingBag, BookOpen } from 'lucide-react';

interface FullGalleryViewProps {
  onClose: () => void;
  initialCategory?: GalleryCategory;
}

export const FullGalleryView: React.FC<FullGalleryViewProps> = ({
  onClose,
  initialCategory = 'All',
}) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>(initialCategory);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filtered items based on selected category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleOpenLightbox = (index: number) => {
    soundEngine.playFlameWarmth();
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleCategoryChange = (cat: GalleryCategory) => {
    soundEngine.playPageTurn();
    setActiveCategory(cat);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#241C15] selection:bg-[#C9A45C] selection:text-[#0A0806] font-garamond animate-fade-in">
      {/* 1. TOP EDITORIAL STICKY HEADER */}
      <header
        className="sticky top-0 z-30 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#D6C29C]/40 px-4 sm:px-8 py-3 shadow-sm"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => {
              soundEngine.playFlameWarmth();
              onClose();
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#C9A45C]/40 bg-[#FFFFFF] hover:bg-[#F2ECE1] text-[#7A542B] font-sans text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xs hover:shadow min-h-[36px]"
            title="Return to Sanctum"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sanctum</span>
          </button>

          {/* Center Brand */}
          <div className="text-center hidden sm:block">
            <h1 className="font-cinzel text-xs font-semibold uppercase tracking-[0.24em] text-[#8C6430]">
              Thirtha Yatra • Photographic Archive
            </h1>
          </div>

          {/* Amazon Direct Link */}
          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playTempleBell()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#8C6430] hover:bg-[#725024] text-[#FAF7F2] font-sans text-xs font-medium uppercase tracking-wider transition-all duration-200 shadow-sm min-h-[36px]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Get Book</span>
          </a>
        </div>
      </header>

      {/* 2. EDITORIAL EXHIBITION MASTHEAD */}
      <section className="pt-8 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-[#C9A45C]/50 bg-[#FFFFFF] text-[#8C6430] text-[10px] uppercase font-cinzel tracking-[0.2em] font-semibold mb-4 sm:mb-5 shadow-xs">
          <BookOpen className="w-3 h-3 text-[#8C6430]" />
          <span>The Photographic Folio • Curated Archive</span>
        </div>

        <h2 className="font-garamond text-3xl sm:text-6xl font-semibold tracking-tight text-[#1D1610] mb-3 sm:mb-4 leading-tight">
          Sacred Places, Temples & Journey
        </h2>

        <p className="font-garamond text-base sm:text-xl text-[#5C4A3A] italic max-w-2xl mx-auto leading-relaxed">
          “An authentic visual documentation of the consecrated kshetras, soaring granite towers, and auspicious moments from the author&apos;s pilgrimage.”
        </p>

        <div className="w-20 sm:w-24 h-px bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent mx-auto mt-6 sm:mt-8" />
      </section>

      {/* 3. CATEGORY FILTER TABS (Swipeable on mobile) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-8 sm:mb-12">
        <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center gap-2 sm:gap-3 pb-2 px-1 max-w-full">
          {GALLERY_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 sm:px-5 py-2 rounded-full font-cinzel text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[38px] ${
                  isActive
                    ? 'bg-[#8C6430] text-[#FAF7F2] shadow-md border border-[#8C6430]'
                    : 'bg-[#FFFFFF] text-[#5C4A3A] hover:bg-[#F2ECE1] border border-[#D6C29C]/50 shadow-xs'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#FAF7F2]/20 text-[#FAF7F2]' : 'bg-[#EAE2D3] text-[#7A542B]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. HERITAGE ARCHIVAL MASONRY / GRID */}
      <main className="px-4 sm:px-8 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => handleOpenLightbox(idx)}
              className="group bg-[#FFFFFF] rounded-xl border border-[#D6C29C]/50 overflow-hidden shadow-[0_4px_24px_rgba(40,25,10,0.06)] hover:shadow-[0_12px_36px_rgba(40,25,10,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
            >
              {/* Image Frame with Warm Museum Border */}
              <div className="relative w-full overflow-hidden bg-[#EFE9DE] p-2.5 sm:p-3 pb-0">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-56 sm:h-72 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Plate label badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#D6C29C] text-[10px] font-cinzel uppercase tracking-[0.16em] text-[#7A542B] font-semibold shadow-xs">
                    {item.plateNumber}
                  </div>

                  {/* Quick Expand Icon */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#C9A45C]/50 flex items-center justify-center text-[#7A542B] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Archival Museum Metadata Plate */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-cinzel uppercase tracking-[0.18em] text-[#8C6430] font-semibold mb-1.5">
                    <span>{item.category}</span>
                    {item.location && (
                      <span className="flex items-center gap-1 font-sans text-[#7A6652] normal-case tracking-normal text-[11px]">
                        <MapPin className="w-3 h-3 text-[#8C6430]" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-garamond text-2xl font-bold text-[#1D1610] group-hover:text-[#8C6430] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="font-garamond text-sm text-[#8C6430] italic mt-0.5 mb-2.5">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="font-garamond text-sm text-[#4E3E30] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE2D3] flex items-center justify-between text-xs font-sans text-[#7A6652]">
                  <span className="text-[11px] font-cinzel uppercase tracking-[0.12em] text-[#8C6430] group-hover:underline">
                    View in High Resolution →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 5. ELEGANT CLOSING HERO STRIP */}
      <footer className="bg-[#15120F] text-[#F2E7D0] border-t border-[#C9A45C]/30 py-16 px-4 sm:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="font-cinzel text-xs uppercase tracking-[0.24em] text-[#C9A45C]">
            Thirtha Yatra Guide • By {BOOK_METADATA.author}
          </div>
          <h3 className="font-garamond text-3xl sm:text-4xl font-semibold text-[#F2E7D0]">
            Experience the Complete Pilgrimage
          </h3>
          <p className="font-garamond text-base text-[#D6C29C] italic">
            Over 380 pages detailing sthala puranas, sacred theertham protocols, and architectural histories across India.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={BOOK_METADATA.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playTempleBell()}
              className="px-6 py-3 rounded-lg bg-gradient-to-b from-[#D4AF37] to-[#B89047] text-[#0A0806] font-sans text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-antique-gold/20 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order on Amazon</span>
            </a>

            <button
              onClick={() => {
                soundEngine.playFlameWarmth();
                onClose();
              }}
              className="px-6 py-3 rounded-lg border border-[#C9A45C]/40 hover:border-[#C9A45C] bg-[#211A14] text-[#C9A45C] hover:text-[#F2E7D0] font-sans text-xs sm:text-sm font-medium uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Back to Sanctum</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 6. FULLSCREEN HIGH-RESOLUTION LIGHTBOX */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          isOpen={true}
          onClose={handleCloseLightbox}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
};
