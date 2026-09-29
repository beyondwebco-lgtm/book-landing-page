import { useState, useEffect } from 'react';
import { BookHeroExperience } from './components/three/BookHeroExperience';
import { TempleMapSection } from './components/sections/TempleMapSection';
import { BookSpreadViewer } from './components/sections/BookSpreadViewer';
import { GalleryPreviewSection } from './components/sections/GalleryPreviewSection';
import { FullGalleryView } from './components/gallery/FullGalleryView';
import { GalleryLightbox } from './components/gallery/GalleryLightbox';
import { AuthorSection } from './components/sections/AuthorSection';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/ui/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { BOOK_METADATA } from './lib/bookData';
import { PREVIEW_GALLERY_ITEMS, type GalleryItem } from './lib/galleryData';
import { soundEngine } from './lib/soundEngine';
import { Compass, BookOpen, Feather, ShoppingBag, Camera } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);
  const [previewLightboxIndex, setPreviewLightboxIndex] = useState<number | null>(null);

  // Sync state with URL hash (#gallery)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#gallery') {
        setIsFullGalleryOpen(true);
      } else if (isFullGalleryOpen && window.location.hash !== '#gallery') {
        setIsFullGalleryOpen(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isFullGalleryOpen]);

  const handleOpenFullGallery = () => {
    window.location.hash = '#gallery';
    setIsFullGalleryOpen(true);
  };

  const handleCloseFullGallery = () => {
    setIsFullGalleryOpen(false);
    if (window.location.hash === '#gallery') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleOpenPreviewLightbox = (item: GalleryItem) => {
    const idx = PREVIEW_GALLERY_ITEMS.findIndex((p) => p.id === item.id);
    if (idx !== -1) {
      setPreviewLightboxIndex(idx);
    }
  };

  // Initialize audio context on first interaction (required by iOS/Android)
  useEffect(() => {
    const unlockAudio = () => {
      soundEngine.toggleMute();
      soundEngine.toggleMute(); // keep state unchanged, simply initializes AudioContext
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-deep-obsidian text-warm-ivory selection:bg-antique-gold selection:text-deep-obsidian">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* FLOATING SANCTUARY NAVIGATION (RESPONSIVE ANCIENT TEMPLE STONE & BRONZE PLAQUE) */}
      {!isFullGalleryOpen && (
        <nav
          className="fixed left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-16px)] sm:max-w-max overflow-x-auto no-scrollbar shadow-2xl transition-all duration-300"
          style={{
            top: 'max(10px, env(safe-area-inset-top, 10px))',
            backgroundColor: '#15120F',
            backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.96) 0%, rgba(17, 14, 11, 0.98) 100%)',
            border: '1px solid rgba(201, 164, 92, 0.32)',
            borderRadius: '10px',
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(201, 164, 92, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <a
            href="#book-hero"
            onClick={() => soundEngine.playFlameWarmth()}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-antique-gold hover:text-white active:scale-95 transition-all whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3 text-antique-gold shrink-0" />
            <span>Sanctum</span>
          </a>

          <a
            href="#book-viewer-section"
            onClick={() => soundEngine.playFlameWarmth()}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-[#D6C29C] hover:text-white active:scale-95 transition-all whitespace-nowrap"
          >
            <BookOpen className="w-3 h-3 opacity-75 shrink-0" />
            <span>Manuscript</span>
          </a>

          <a
            href="#temples-section"
            onClick={() => soundEngine.playFlameWarmth()}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-[#D6C29C] hover:text-white active:scale-95 transition-all whitespace-nowrap"
          >
            <Compass className="w-3 h-3 opacity-75 shrink-0" />
            <span>Kshetras</span>
          </a>

          {/* Gallery Navigation Link */}
          <a
            href="#gallery"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playFlameWarmth();
              handleOpenFullGallery();
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-[#D6C29C] hover:text-white active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Camera className="w-3 h-3 opacity-85 shrink-0" />
            <span>Gallery</span>
          </a>

          <a
            href="#author-section"
            onClick={() => soundEngine.playFlameWarmth()}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-[#D6C29C] hover:text-white active:scale-95 transition-all whitespace-nowrap"
          >
            <Feather className="w-3 h-3 opacity-75 shrink-0" />
            <span>Author</span>
          </a>

          <a
            href={BOOK_METADATA.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.playTempleBell()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-b from-[#D4AF37] to-[#B89047] text-[#0A0806] text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.06em] shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span>Buy</span>
          </a>
        </nav>
      )}


      {/* 1. MASTER 3D BOOK & TEMPLE SCROLL TIMELINE */}
      <section id="book-hero">
        <BookHeroExperience />
      </section>

      {/* 2. SACRED EDITORIAL MANUSCRIPT SPREAD VIEWER */}
      <BookSpreadViewer />

      {/* 3. VERIFIED PILGRIMAGE TOPOGRAPHY & INTERACTIVE MAP */}
      <TempleMapSection />

      {/* 4. VISUAL PILGRIMAGE GALLERY PREVIEW */}
      <GalleryPreviewSection
        onOpenFullGallery={handleOpenFullGallery}
        onOpenLightbox={handleOpenPreviewLightbox}
      />

      {/* 5. AUTHOR SECTION */}
      <AuthorSection />

      {/* 6. DRAMATIC FINAL CTA WITH DIRECT AMAZON LINK */}
      <FinalCTA />

      {/* 7. MINIMAL FOOTER */}
      <Footer />

      {/* HOMEPAGE PREVIEW LIGHTBOX */}
      {previewLightboxIndex !== null && (
        <GalleryLightbox
          items={PREVIEW_GALLERY_ITEMS}
          currentIndex={previewLightboxIndex}
          isOpen={true}
          onClose={() => setPreviewLightboxIndex(null)}
          onNavigate={(newIdx) => setPreviewLightboxIndex(newIdx)}
        />
      )}

      {/* FULL DEDICATED EDITORIAL GALLERY VIEW */}
      {isFullGalleryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <FullGalleryView onClose={handleCloseFullGallery} />
        </div>
      )}
    </div>
  );
}

export default App;

