import React from 'react';
import { PREVIEW_GALLERY_ITEMS, type GalleryItem } from '../../lib/galleryData';
import { soundEngine } from '../../lib/soundEngine';
import { Camera, ArrowRight, MapPin, Maximize2 } from 'lucide-react';

interface GalleryPreviewSectionProps {
  onOpenFullGallery: () => void;
  onOpenLightbox: (item: GalleryItem) => void;
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({
  onOpenFullGallery,
  onOpenLightbox,
}) => {
  return (
    <section id="gallery-preview" className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto text-warm-ivory overflow-hidden">
      {/* Background Sacred Geometric Mandala Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl aspect-square rounded-full border border-antique-gold/10 opacity-15 pointer-events-none overflow-hidden" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-antique-gold/30 bg-[#211A14]/80 text-antique-gold text-[10px] uppercase font-cinzel tracking-[0.14em] sm:tracking-[0.2em] font-semibold mb-3 sm:mb-4 shadow-md max-w-full">
          <Camera className="w-3 h-3 text-antique-gold shrink-0" />
          <span className="truncate">Visual Chronicle • Mandapa IV-B</span>
        </div>
        <h2 className="font-garamond text-3xl sm:text-5xl font-semibold tracking-tight text-warm-ivory mb-2 sm:mb-3 leading-tight">
          The Pilgrimage Gallery
        </h2>
        <p className="font-garamond text-base sm:text-xl text-aged-parchment italic leading-relaxed">
          “Sacred kshetras, soaring granite gopurams, and moments from the author&apos;s devoted path — documented in authentic field photographs.”
        </p>
      </div>

      {/* Curated 8-Photo Editorial Grid (2 columns on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-14">
        {PREVIEW_GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              soundEngine.playFlameWarmth();
              onOpenLightbox(item);
            }}
            className="group relative bg-[#15120F] border border-antique-gold/25 hover:border-antique-gold/70 active:scale-[0.98] rounded-lg sm:rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0806]">
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Plate Tag Overlay */}
              <div className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded bg-[#0A0806]/85 backdrop-blur-sm border border-antique-gold/30 text-[8px] sm:text-[9px] font-cinzel uppercase tracking-[0.16em] text-antique-gold font-semibold">
                {item.plateNumber}
              </div>

              {/* Quick Expand Icon Overlay */}
              <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#15120F]/85 backdrop-blur-sm border border-antique-gold/30 flex items-center justify-center text-antique-gold opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            {/* Content Plate */}
            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#15120F] to-[#110E0B]">
              <div>
                <span className="text-[8px] sm:text-[10px] font-cinzel uppercase tracking-[0.15em] text-antique-gold/80 block mb-0.5 sm:mb-1">
                  {item.category}
                </span>
                <h3 className="font-garamond text-xs sm:text-base md:text-lg font-bold text-warm-ivory group-hover:text-antique-gold transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-antique-gold/15 flex items-center justify-between text-[10px] sm:text-xs font-sans text-aged-parchment/70">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] truncate">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-antique-gold/80 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </span>
                <span className="text-[9px] sm:text-[11px] font-cinzel text-antique-gold/80 shrink-0 ml-1">
                  View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent "View Full Gallery" CTA Button */}
      <div className="flex flex-col items-center justify-center gap-3">
        <button
          onClick={() => {
            soundEngine.playTempleBell();
            onOpenFullGallery();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 rounded-lg bg-gradient-to-b from-[#D4AF37] to-[#B89047] text-[#0A0806] font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] shadow-xl hover:shadow-antique-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-[#E5C37A]/40 min-h-[46px]"
        >
          <span>View Full Gallery (18 Photographs)</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>

        <p className="font-garamond text-xs text-aged-parchment/60 italic text-center">
          Explore all temples, Himalayan dhams, coastal shrines, and the author&apos;s book release
        </p>
      </div>
    </section>
  );
};
