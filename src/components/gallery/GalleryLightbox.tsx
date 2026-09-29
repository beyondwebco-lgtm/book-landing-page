import React, { useEffect, useCallback, useRef } from 'react';
import { type GalleryItem } from '../../lib/galleryData';
import { soundEngine } from '../../lib/soundEngine';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];
  const touchStartXRef = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    soundEngine.playPageTurn();
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIdx);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    soundEngine.playPageTurn();
    const nextIdx = (currentIndex + 1) % items.length;
    onNavigate(nextIdx);
  }, [currentIndex, items.length, onNavigate]);

  const handleClose = useCallback(() => {
    soundEngine.playFlameWarmth();
    onClose();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  // Touch gesture handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilgrimage Photo Lightbox"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0A0806]/95 backdrop-blur-xl animate-fade-in select-none"
      style={{ height: '100dvh' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-antique-gold/20 bg-[#15120F]/90 backdrop-blur-md z-10 shrink-0"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))' }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-cinzel text-xs uppercase tracking-[0.2em] text-antique-gold font-semibold">
            {currentItem.plateNumber}
          </span>
          <span className="text-antique-gold/40 text-xs">•</span>
          <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-cinzel uppercase tracking-[0.16em] bg-antique-gold/10 text-antique-gold border border-antique-gold/25 truncate max-w-[120px] sm:max-w-none">
            {currentItem.category}
          </span>
        </div>

        {/* Counter & Close */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="font-garamond text-xs sm:text-sm text-aged-parchment/80 tracking-widest">
            <span className="text-antique-gold font-semibold">{currentIndex + 1}</span> / {items.length}
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-lg bg-[#211A14] border border-antique-gold/30 hover:border-antique-gold text-antique-gold hover:text-warm-ivory transition-colors cursor-pointer group min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Close Lightbox (Esc)"
            aria-label="Close Lightbox"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Nav Arrows */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-1.5 sm:left-6 z-20 p-2 sm:p-3.5 rounded-full bg-[#15120F]/90 hover:bg-[#C9A45C] border border-antique-gold/30 hover:border-antique-gold text-antique-gold hover:text-[#0A0806] shadow-xl backdrop-blur-md transition-all cursor-pointer group min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Previous Photograph (←)"
          aria-label="Previous Photograph"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Image Stage */}
        <div
          className="relative max-w-5xl max-h-[54dvh] sm:max-h-[72vh] flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-[#110E0B] border border-antique-gold/20 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            key={currentItem.id}
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="max-w-full max-h-[50dvh] sm:max-h-[68vh] object-contain rounded transition-opacity duration-300 animate-fade-in"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-1.5 sm:right-6 z-20 p-2 sm:p-3.5 rounded-full bg-[#15120F]/90 hover:bg-[#C9A45C] border border-antique-gold/30 hover:border-antique-gold text-antique-gold hover:text-[#0A0806] shadow-xl backdrop-blur-md transition-all cursor-pointer group min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="Next Photograph (→)"
          aria-label="Next Photograph"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Editorial Caption Bar */}
      <div
        className="w-full bg-[#15120F]/95 border-t border-antique-gold/20 px-4 sm:px-8 py-3 sm:py-4 z-10 shrink-0"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <h3 className="font-garamond text-base sm:text-xl font-bold text-warm-ivory tracking-wide">
                {currentItem.title}
              </h3>
              {currentItem.subtitle && (
                <span className="font-garamond text-xs sm:text-sm text-antique-gold italic">
                  — {currentItem.subtitle}
                </span>
              )}
            </div>

            <p className="font-garamond text-xs sm:text-sm text-aged-parchment/90 line-clamp-2 max-w-2xl leading-relaxed">
              {currentItem.description}
            </p>
          </div>

          {/* Location Badge */}
          {currentItem.location && (
            <div className="inline-flex items-center justify-center sm:justify-end gap-1.5 px-2.5 py-0.5 rounded bg-[#211A14] border border-antique-gold/25 text-antique-gold text-[10px] sm:text-[11px] font-sans shrink-0 self-center sm:self-auto shadow-sm">
              <MapPin className="w-3 h-3 text-antique-gold" />
              <span>{currentItem.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
